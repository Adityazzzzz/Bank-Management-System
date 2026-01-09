"use server";

import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify, generateCardDetails } from "@/lib/utils";
import { revalidatePath } from "next/cache"; // IMPORT THIS

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_CARD_COLLECTION_ID: CARD_COLLECTION_ID,
} = process.env;

export const createVirtualCard = async ({ userId, label }: { userId: string; label: string }) => {
  try {
    const { database } = await createAdminClient();
    
    const cardDetails = generateCardDetails();

    const newCard = await database.createDocument(
      DATABASE_ID!,
      CARD_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        label,
        ...cardDetails,
        status: 'active'
      }
    );
    revalidatePath('/my-cards'); 

    return parseStringify(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
  }
};

export const getCards = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();
    const cards = await database.listDocuments(
      DATABASE_ID!,
      CARD_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );
    return parseStringify(cards.documents);
  } catch (error) {
    console.log(error);
  }
};