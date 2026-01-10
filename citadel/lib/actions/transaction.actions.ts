"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        channel: 'online',
        category: 'Transfer',
        date: new Date().toISOString(),
        ...transaction
      }
    )

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const { database } = await createAdminClient();

    const senderTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('senderBankId', bankId)],
    )

    const receiverTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('receiverBankId', bankId)],
    );
    const allTransactions = [
        ...senderTransactions.documents, 
        ...receiverTransactions.documents
    ];

    const uniqueTransactionsMap = new Map();
    allTransactions.forEach((tx) => {
        uniqueTransactionsMap.set(tx.$id, tx);
    });

    const uniqueDocuments = Array.from(uniqueTransactionsMap.values());

    const transactions = {
      total: uniqueDocuments.length,
      documents: uniqueDocuments
    }

    return parseStringify(transactions);
  } 
  catch (error) {
    console.log(error);
    return {
      total: 0,
      documents: []
    }
  }
}

export const createManualTransaction = async (transaction: {
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}) => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        userId: transaction.userId,
        amount: String(transaction.amount), // Convert number to string for DB
        category: transaction.category,
        name: transaction.description,
        type: 'manual',
        date: transaction.date,
        channel: 'manual',
        
        // FIX: Add these dummy values to satisfy the "Required" schema
        senderId: transaction.userId,
        receiverId: transaction.userId,
        senderBankId: "manual_cash_wallet",
        receiverBankId: "manual_cash_wallet",
        email: "manual_expense@citadel.com", // Placeholder email
      }
    );

    return parseStringify(newTransaction);
  } catch (error) {
    console.error("Error creating manual transaction:", error);
  }
};

export const getManualTransactions = async (userId: string) => {
  try {
    const { database } = await createAdminClient();
    
    const transactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    return parseStringify(transactions.documents);
  } catch (error) {
    // UPDATED: Log the full error to see why it fails
    console.error("FAILED to fetch manual transactions:", error); 
    return [];
  }
};