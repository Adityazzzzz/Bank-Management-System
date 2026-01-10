"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, Check, Wallet, User, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createP2PTransfer } from "@/lib/actions/payment.actions";
import { toast } from "sonner";
import { formatAmount } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.string().min(1, "Amount is required"),
  senderBank: z.string().min(1, "Please select a source account"),
  note: z.string().optional(),
});

const P2PForm = ({ accounts, userId }: { accounts: any[], userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Track selected bank for balance display
  const [selectedBankId, setSelectedBankId] = useState(accounts[0]?.$id || "");
  const selectedAccount = accounts.find(a => a.appwriteItemId === selectedBankId || a.$id === selectedBankId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      amount: "",
      senderBank: selectedBankId,
      note: "",
    },
  });

  const handleBankChange = (value: string) => {
    setSelectedBankId(value);
    form.setValue("senderBank", value);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await createP2PTransfer({
        senderId: userId,
        senderBankId: data.senderBank,
        receiverEmail: data.email,
        amount: Number(data.amount),
        note: data.note || "Instant Transfer",
        path: "/payment-transfer",
      });

      setSuccess(true);
      toast.success("Transfer initiated successfully");
      form.reset();
      form.setValue("senderBank", selectedBankId);
      setTimeout(() => setSuccess(false), 2500);

    } catch (error: any) {
      toast.error(error.message || "Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       {/* Header */}
       <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Send Payment</h2>
            <p className="text-sm text-gray-500 mt-1">Transfer funds instantly to another Citadel user.</p>
       </div>

       <div className="p-8">
            {success ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                        <Check size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Transfer Successful</h3>
                    <p className="text-gray-500 mt-2">Your money has been sent securely.</p>
                    <Button variant="outline" className="mt-8" onClick={() => setSuccess(false)}>
                        Make another transfer
                    </Button>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* SECTION 1: SOURCE */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="senderBank"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700 flex justify-between">
                                        From Account
                                        {selectedAccount && (
                                            <span className="text-blue-600 font-semibold">
                                                Available: {formatAmount(selectedAccount.currentBalance)}
                                            </span>
                                        )}
                                    </FormLabel>
                                    <Select onValueChange={handleBankChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="h-11 bg-white border-gray-300 focus:ring-2 focus:ring-blue-100">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Wallet size={16} />
                                                <SelectValue placeholder="Select a bank" />
                                            </div>
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {accounts.map((account) => (
                                                <SelectItem key={account.appwriteItemId || account.$id} value={account.appwriteItemId || account.$id}>
                                                    {account.name} <span className="text-gray-400 ml-1">•••• {account.mask}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <div className="h-px bg-gray-100 my-4" />

                        {/* SECTION 2: DESTINATION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Recipient Email</FormLabel>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-400" size={16}/>
                                        <FormControl>
                                            <Input placeholder="username@citadel.com" {...field} className="pl-9 h-11 border-gray-300 focus:ring-2 focus:ring-blue-100"/>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">Amount</FormLabel>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={16}/>
                                        <FormControl>
                                            <Input placeholder="0.00" {...field} type="number" className="pl-9 h-11 border-gray-300 focus:ring-2 focus:ring-blue-100" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Memo (Optional)</FormLabel>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-gray-400" size={16}/>
                                    <FormControl>
                                        <Input placeholder="e.g. Dinner, Rent" {...field} className="pl-9 h-11 border-gray-300 focus:ring-2 focus:ring-blue-100"/>
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        {/* SUBMIT */}
                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm transition-all" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin mr-2" />
                                ) : (
                                    <Send size={18} className="mr-2" />
                                )}
                                {isLoading ? 'Processing...' : 'Send Payment'}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
       </div>
    </div>
  );
};

export default P2PForm;