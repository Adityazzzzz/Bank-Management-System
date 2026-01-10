"use client";

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { toggleCardStatus, deleteCard } from '@/lib/actions/card.actions'
import { toast } from 'sonner'
import { Loader2, Lock, Trash2, Unlock } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const VirtualCard = ({ card }: { card: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isFrozen = card.status === 'frozen';

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      await toggleCardStatus({ 
        cardId: card.$id, 
        status: card.status, 
        path: '/my-cards' 
      });
      toast.success(isFrozen ? "Card Unfrozen" : "Card Frozen Successfully");
    } catch (error) {
      toast.error("Failed to update card status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCard({ cardId: card.$id, path: '/my-cards' });
      toast.success("Card deleted");
    } catch (error) {
      toast.error("Failed to delete card");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
        {/* CARD VISUAL */}
        <div className={`relative flex h-[190px] w-full max-w-[320px] flex-col justify-between rounded-[20px] border border-white bg-gradient-to-r from-[#0179FE] to-[#4893FF] p-6 shadow-xl transition-all duration-300 ${isFrozen ? 'grayscale brightness-[0.7]' : 'hover:shadow-2xl'}`}>
        
        {isFrozen && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[20px] bg-black/40 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md border border-white/30 shadow-lg">
                    <Lock size={16} />
                    <span className="text-12 font-bold tracking-wider">FROZEN</span>
                </div>
            </div>
        )}

        <div className="absolute right-0 top-0 size-40 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center z-10">
            <Image src="/icons/logo.svg" width={30} height={30} alt="Citadel" className="brightness-200 invert" /> 
            <span className="text-12 font-semibold text-white/80 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">{card.status}</span>
        </div>

        <div className="z-10 flex flex-col gap-1">
            <h1 className="text-24 font-mono font-bold tracking-[4px] text-white shadow-sm">
            {isFrozen 
                ? `**** **** **** ${card.cardNumber.slice(-4)}` 
                : card.cardNumber.match(/.{1,4}/g)?.join(' ')
            }
            </h1>
        </div>

        <div className="flex justify-between items-end z-10">
            <div className="flex flex-col">
            <p className="text-10 font-medium text-white/70 uppercase">Card Holder</p>
            <p className="text-14 font-semibold text-white tracking-wide truncate max-w-[150px]">{card.label}</p>
            </div>
            <div className="flex flex-col items-end">
            <p className="text-10 font-medium text-white/70 uppercase">Expires</p>
            <p className="text-14 font-semibold text-white tracking-wide">{card.expiryDate}</p>
            </div>
        </div>
        </div>

        {/* MODERN CONTROLS */}
        <div className="flex w-full max-w-[320px] items-center gap-2 rounded-xl bg-gray-50 p-1.5 border border-gray-100">
            <Button 
                onClick={handleToggleStatus} 
                disabled={isLoading}
                variant="ghost"
                className={`flex-1 h-9 rounded-lg font-medium text-12 transition-all ${isFrozen 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                    : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}
            >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={14} /> : isFrozen ? <Unlock size={14} className="mr-2"/> : <Lock size={14} className="mr-2"/>}
                {isFrozen ? "Unfreeze Card" : "Freeze Card"}
            </Button>
            
            <div className="h-4 w-[1px] bg-gray-200"></div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                    disabled={isLoading}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Virtual Card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this card. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>
  )
}

export default VirtualCard