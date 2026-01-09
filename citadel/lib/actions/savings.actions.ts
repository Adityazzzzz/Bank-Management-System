"use server";
import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_POT_COLLECTION_ID: POT_COLLECTION_ID,
} = process.env;

export const createPot = async ({ userId, name, targetAmount }: any) => {
    const { database } = await createAdminClient();
    const pot = await database.createDocument(DATABASE_ID!, POT_COLLECTION_ID!, ID.unique(), {
        userId, name, targetAmount: Number(targetAmount), currentAmount: 0
    });

    revalidatePath('/my-cards'); // FIX
    return parseStringify(pot);
}

export const getPots = async (userId: string) => {
    const { database } = await createAdminClient();
    const pots = await database.listDocuments(DATABASE_ID!, POT_COLLECTION_ID!, [
        Query.equal('userId', userId)
    ]);
    return parseStringify(pots.documents);
}

export const fundPot = async (potId: string, amount: number, currentBalance: number) => {
    const { database } = await createAdminClient();
    const updatedPot = await database.updateDocument(DATABASE_ID!, POT_COLLECTION_ID!, potId, {
        currentAmount: currentBalance + amount
    });

    revalidatePath('/my-cards'); // FIX
    return parseStringify(updatedPot);
}