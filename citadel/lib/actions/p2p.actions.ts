"use server";

import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_WALLET_COLLECTION_ID: WALLET_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const p2pTransfer = async ({ senderId, receiverEmail, amount, pin }: P2PTransferProps) => {
  const { database } = await createAdminClient();

  try {
    // 1. Find Sender's Wallet
    const senderWalletList = await database.listDocuments(DATABASE_ID!, WALLET_COLLECTION_ID!, [
      Query.equal('userId', senderId)
    ]);
    const senderWallet = senderWalletList.documents[0];

    // 2. Verify Balance & PIN
    if (!senderWallet || senderWallet.balance < amount) throw new Error("Insufficient funds");
    if (senderWallet.pin !== pin) throw new Error("Incorrect PIN");

    // 3. Find Receiver's Wallet via Email (You need to fetch userId from email first normally, simplified here)
    // NOTE: In a real app, you'd look up the user by email first to get their userId
    // For this prototype, let's assume you pass the Receiver's User ID directly or look it up.
    
    // ... [Lookup Logic for Receiver ID] ...
    
    // 4. Perform Atomic Transfer (Pseudo-code for logic)
    // Decrement Sender
    await database.updateDocument(DATABASE_ID!, WALLET_COLLECTION_ID!, senderWallet.$id, {
        balance: senderWallet.balance - amount
    });

    // Increment Receiver
    // (Fetch receiver wallet first...)
    await database.updateDocument(DATABASE_ID!, WALLET_COLLECTION_ID!, receiverWallet.$id, {
        balance: receiverWallet.balance + amount
    });

    // 5. Log Transaction
    await database.createDocument(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, ID.unique(), {
        senderId,
        receiverId,
        amount,
        type: 'p2p',
        status: 'Success',
        date: new Date().toISOString()
    });

    return { success: true };

  } catch (error) {
    console.error("P2P Transfer Error:", error);
    return { success: false, error: error.message };
  }
}