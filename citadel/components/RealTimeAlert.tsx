"use client";

import { useEffect } from 'react';
import { Client } from 'appwrite';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

const RealTimeAlert = ({ userId }: { userId: string }) => {
  const pathname = usePathname();

  useEffect(() => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) 
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
        if(response.events.includes("databases.*.collections.*.documents.*.create")) {
            const payload = response.payload as any;
            if (payload.receiverId === userId && payload.senderId !== userId) {
                toast.success("Money Received! 💰", {
                    description: `You received $${payload.amount} from ${payload.senderBankId === 'manual_cash_wallet' ? 'Cash' : 'a transfer'}.`,
                    duration: 5000,
                    className: "bg-green-50 border-green-200 text-green-800", 
                });
            }
        }
    });
    return () => {
        unsubscribe();
    }
  }, [userId, pathname]);

  return null; 
}

export default RealTimeAlert;