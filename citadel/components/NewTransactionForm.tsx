"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createManualTransaction } from "@/lib/actions/transaction.actions";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Food", "Travel", "Shopping", "Tech", "Bills", "Health", "Other"];

const NewTransactionForm = ({ userId }: { userId: string }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const dateInput = formData.get("date") as string;
        const transactionDate = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString();

        await createManualTransaction({
            userId,
            amount: Number(formData.get("amount")),
            category: formData.get("category") as string,
            description: formData.get("description") as string,
            date: transactionDate,
        });

        setOpen(false);
        router.refresh();
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 w-full mt-2">
                <PlusCircle size={16} /> Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Manual Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" required placeholder="0.00" />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input 
                                id="date" 
                                name="date" 
                                type="date" 
                                required 
                                defaultValue={new Date().toISOString().split('T')[0]} // Default to today
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" required placeholder="e.g. Lunch at McD" />
                    </div>

                    <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white mt-2">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Save Transaction"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewTransactionForm;