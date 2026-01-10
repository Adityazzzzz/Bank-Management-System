"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Search, Send, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createP2PTransfer } from "@/lib/actions/payment.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.string().min(1, "Amount is required"),
  senderBank: z.string().min(1, "Please select a source account"), // Added validation
  note: z.string().optional(),
});

const PaymentTransferForm2 = ({ accounts, userId }: { accounts: any[], userId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      amount: "",
      senderBank: accounts[0]?.$id || "", // Default to first account if exists
      note: "",
    },
  });

  // 1. CHECK: If no accounts exist, show a warning instead of the form
  if (!accounts || accounts.length === 0) {
      return (
          <div className="flex flex-col gap-4 items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
              <div className="bg-red-50 p-3 rounded-full text-red-600">
                  <CreditCard size={32} />
              </div>
              <div>
                  <h2 className="text-18 font-bold text-gray-900">No Bank Account Found</h2>
                  <p className="text-14 text-gray-500 max-w-[300px]">You need to link a bank account to fund your transfers.</p>
              </div>
              <Link href="/connect-bank">
                <Button className="bg-blue-600 hover:bg-blue-700">Connect Bank</Button>
              </Link>
          </div>
      )
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await createP2PTransfer({
        senderId: userId,
        senderBankId: data.senderBank, // Use selected bank
        receiverEmail: data.email,
        amount: Number(data.amount),
        note: data.note || "Instant Transfer",
        path: "/payment-transfer",
      });

      setSuccess(true);
      toast.success("Transfer Successful! 💸");
      form.reset();
      setTimeout(() => setSuccess(false), 3000);

    } catch (error: any) {
      toast.error(error.message || "Failed to send money");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm max-w-[500px] w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-20 font-bold text-gray-900">Instant Transfer</h2>
        <p className="text-14 text-gray-500">Send money instantly to another Citadel user.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          {/* NEW: SOURCE ACCOUNT SELECTOR */}
          <FormField
            control={form.control}
            name="senderBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-12 font-medium text-gray-700">From Account</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                        {accounts.map((account) => (
                            <SelectItem key={account.$id} value={account.$id}>
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium text-14">{account.name}</span>
                                    <span className="text-10 text-gray-500">**** {account.mask} • ${account.currentBalance}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-12 font-medium text-gray-700">Receiver's Email</FormLabel>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                    <FormControl>
                        <Input placeholder="user@citadel.com" {...field} className="pl-9 bg-gray-50 border-gray-200"/>
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
                <FormLabel className="text-12 font-medium text-gray-700">Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                    <Input placeholder="0.00" {...field} type="number" className="pl-8 bg-gray-50 border-gray-200" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-12 font-medium text-gray-700">Note (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Dinner, Rent, etc." {...field} className="bg-gray-50 border-gray-200" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2">
            <Button type="submit" className={`w-full ${success ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : success ? (
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} /> Sent!
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Send size={18} /> Send Money
                    </div>
                )}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default PaymentTransferForm2;