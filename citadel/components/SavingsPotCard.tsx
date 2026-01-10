"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { formatAmount } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; 
import { fundPot, deletePot } from "@/lib/actions/savings.actions";
import { toast } from "sonner"; 
import { Trash2, TrendingUp, CheckCircle2, Plus, X, Loader2 } from "lucide-react";
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

const SavingsPotCard = ({ pot }: { pot: any }) => {
  const [amount, setAmount] = useState("");
  const [showInput, setShowInput] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const percentage = Math.min((pot.currentAmount / pot.targetAmount) * 100, 100);
  const isCompleted = pot.currentAmount >= pot.targetAmount;

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    const newTotal = pot.currentAmount + Number(amount);
    if (newTotal > pot.targetAmount) {
        toast.error(`Max addition allowed: ${formatAmount(pot.targetAmount - pot.currentAmount)}`);
        return;
    }
    setIsLoading(true);
    await fundPot(pot.$id, Number(amount), pot.currentAmount);
    setAmount("");
    setShowInput(false);
    setIsLoading(false);
    toast.success("Funds added!");
  };

  const handleDelete = async () => {
      setIsLoading(true);
      await deletePot(pot.$id);
      setIsLoading(false);
      toast.success("Pot removed.");
  }

  return (
    <div className="group relative flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
      
      {/* LEFT SIDE: INFO */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
            <div className={`size-10 shrink-0 rounded-full flex items-center justify-center text-lg shadow-sm ${isCompleted ? 'bg-green-100' : 'bg-blue-50'}`}>
                {isCompleted ? '🏆' : '💰'}
            </div>
            <div className="flex flex-col">
                <h3 className="text-14 font-bold text-gray-900 line-clamp-1">{pot.name}</h3>
                <div className="flex items-center gap-2 text-12 text-gray-500 font-medium">
                    <span className="text-gray-900 font-bold">{formatAmount(pot.currentAmount)}</span>
                    <span className="text-gray-300">/</span>
                    <span>{formatAmount(pot.targetAmount)}</span>
                </div>
            </div>
        </div>
        
        <div className="w-full pr-2">
            <Progress 
                value={percentage} 
                className="h-1.5 bg-gray-100 rounded-full" 
            />
        </div>
      </div>

      {/* RIGHT SIDE: ACTIONS */}
      <div className="flex flex-col items-end gap-2 shrink-0">
         <div className={`text-12 font-bold px-2 py-0.5 rounded-md ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
            {percentage.toFixed(0)}%
         </div>

         {isCompleted ? (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 p-0 rounded-full"
                    >
                        <Trash2 size={16} />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                    <AlertDialogTitle>Remove Savings Goal?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You have completed this goal. Removing it will delete the record from your dashboard.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
         ) : (
            showInput ? (
                <div className="flex items-center gap-1 absolute right-2 bottom-2 bg-white shadow-lg border p-1 rounded-lg animate-in slide-in-from-right-5 fade-in z-20">
                     <Input 
                        autoFocus
                        type="number" 
                        placeholder="$" 
                        className="w-16 h-8 text-12 border-none focus-visible:ring-0 px-1 text-right"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button onClick={handleDeposit} size="sm" className="h-7 w-7 bg-blue-600 hover:bg-blue-700 p-0 rounded-md">
                        {isLoading ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={14}/>}
                    </Button>
                    <Button onClick={() => setShowInput(false)} variant="ghost" size="sm" className="h-7 w-7 text-gray-400 p-0 hover:bg-gray-100 rounded-md">
                        <X size={14}/>
                    </Button>
                </div>
            ) : (
                <Button 
                    onClick={() => setShowInput(true)} 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 p-0 rounded-full"
                >
                    <Plus size={16}/>
                </Button>
            )
         )}
      </div>
    </div>
  )
}

export default SavingsPotCard;