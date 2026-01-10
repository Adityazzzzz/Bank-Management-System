"use server";

import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { parseStringify } from "@/lib/utils";

export const createP2PTransfer = async ({
  senderId,
  senderBankId,
  receiverEmail,
  amount,
  note,
  path
}: {
  senderId: string;
  senderBankId: string;
  receiverEmail: string;
  amount: number;
  note: string;
  path: string;
}) => {
  try {
    // FIX: Destructure the NEXT_PUBLIC_ variables directly
    const {
      NEXT_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
      NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
      NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
      NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
    } = process.env;

    // Debug check
    if (!DATABASE_ID) throw new Error("Database ID is missing. Check .env file.");

    const { database } = await createAdminClient();

    // 1. FIND RECEIVER
    const receiverList = await database.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal('email', receiverEmail)]
    );

    if (receiverList.documents.length === 0) {
        throw new Error("Receiver not found. Please check the email.");
    }
    const receiver = receiverList.documents[0];

    // 2. FIND RECEIVER'S BANK
    const receiverBanks = await database.listDocuments(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        [Query.equal('userId', receiver.$id)]
    );

    if (receiverBanks.documents.length === 0) {
        throw new Error("Receiver has no active bank account.");
    }
    const receiverBank = receiverBanks.documents[0]; 

    // 3. GET SENDER'S BANK
    const senderBank = await database.getDocument(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        senderBankId
    );

    if (senderBank.currentBalance < amount) {
        throw new Error("Insufficient funds.");
    }

    // 4. PERFORM TRANSFER
    const newSenderBalance = senderBank.currentBalance - amount;
    await database.updateDocument(
        DATABASE_ID!,
        BANK_COLLECTION_ID!,
        senderBankId,
        { currentBalance: newSenderBalance }
    );

    try {
        const newReceiverBalance = receiverBank.currentBalance + amount;
        await database.updateDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            receiverBank.$id,
            { currentBalance: newReceiverBalance }
        );
    } catch (error) {
        // Rollback
        await database.updateDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            senderBankId,
            { currentBalance: senderBank.currentBalance }
        );
        throw new Error("Transfer failed. Funds have been refunded.");
    }

    // 5. CREATE TRANSACTION RECORD
    const newTransaction = await database.createDocument(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        ID.unique(),
        {
            userId: senderId, 
            senderId: senderId,
            receiverId: receiver.$id,
            amount: String(amount),
            type: 'transfer',
            category: 'Transfer',
            name: `P2P to ${receiver.firstName}`,
            date: new Date().toISOString(),
            status: 'Success',
            channel: 'online',
            senderBankId: senderBankId,
            receiverBankId: receiverBank.$id,
            email: receiverEmail,
        }
    );

    revalidatePath(path);
    return parseStringify(newTransaction);

  } catch (error: any) {
    console.error("P2P Transfer Error:", error);
    throw new Error(error.message || "Transaction failed");
  }
};