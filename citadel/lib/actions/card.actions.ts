"use server";

import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify, generateCardDetails } from "@/lib/utils";
import { revalidatePath } from "next/cache"; // IMPORT THIS

const {
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_CARD_COLLECTION_ID: CARD_COLLECTION_ID,
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

export const toggleCardStatus = async ({ cardId, status, path }: { cardId: string; status: string; path: string }) => {
  try {
    const { database } = await createAdminClient();
    
    const newStatus = status === 'active' ? 'frozen' : 'active';

    const updatedCard = await database.updateDocument(
      DATABASE_ID!,
      CARD_COLLECTION_ID!,
      cardId,
      { status: newStatus }
    );

    revalidatePath(path);
    return parseStringify(updatedCard);
  } catch (error) {
    console.error("Error freezing card:", error);
  }
};

// NEW: Delete Card
export const deleteCard = async ({ cardId, path }: { cardId: string; path: string }) => {
  try {
    const { database } = await createAdminClient();
    
    await database.deleteDocument(
      DATABASE_ID!,
      CARD_COLLECTION_ID!,
      cardId
    );

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting card:", error);
  }
};