"use client";
import { useEffect } from 'react';
import { Client } from 'appwrite';
import { toast } from 'sonner';

const RealTimeAlert = ({ userId }: { userId: string }) => {
  useEffect(() => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    // Subscribe to the 'transactions' channel
    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID}.documents`,
      (response) => {
        const payload = response.payload as any;

        // If a new transaction is created AND I am the receiver
        if (response.events.includes("databases.*.collections.*.documents.create")) {
             if (payload.receiverId === userId) {
                 toast.success(`🤑 You just received $${payload.amount} from ${payload.senderName}!`);
             }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return null; // This component doesn't render anything, it just listens
};

export default RealTimeAlert;