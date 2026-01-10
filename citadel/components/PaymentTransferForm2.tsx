"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, Check, Wallet, User, FileText, DollarSign, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { createP2PTransfer } from "@/lib/actions/payment.actions";
import { verifyOtpForTransaction } from "@/lib/actions/user.actions"; // Ensure this action exists
import { toast } from "sonner";
import { formatAmount } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.string().min(1, "Amount is required"),
  senderBank: z.string().min(1, "Please select a source account"),
  note: z.string().optional(),
});

const P2PForm = ({ accounts, userId, user }: { accounts: any[], userId: string, user: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // OTP State
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null);
  
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

  // 1. Intercept Submit
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // If user has 2FA enabled, stop and show dialog
    if (user.mfaEnabled) {
        setFormData(data);
        setShowOtpDialog(true);
        return;
    }

    // Otherwise proceed directly
    await processTransfer(data);
  };

  // 2. Execute Transfer (Reusable function)
  const processTransfer = async (data: z.infer<typeof formSchema>) => {
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
      setShowOtpDialog(false);
      setFormData(null);
      setOtpCode("");
    }
  };

  // 3. Verify OTP and then Transfer
  const onOtpVerify = async () => {
      if(otpCode.length !== 6 || !formData) return;
      
      setIsLoading(true);
      try {
          await verifyOtpForTransaction(otpCode); // Verify code with Appwrite
          await processTransfer(formData); // If valid, run the transfer
      } catch (error) {
          toast.error("Invalid 2FA Code. Please try again.");
          setIsLoading(false);
      }
  }

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

                        {/* SUBMIT BUTTON */}
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

       {/* OTP VERIFICATION DIALOG */}
       <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
         <DialogContent className="sm:max-w-[400px] bg-white">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-gray-900">
                <ShieldCheck className="text-blue-600" size={24} /> Security Check
             </DialogTitle>
             <DialogDescription className="text-gray-500">
                Please enter the 6-digit code from your authenticator app to confirm this transaction.
             </DialogDescription>
           </DialogHeader>

           <div className="flex flex-col items-center py-6 space-y-4">
                <div className="text-center bg-gray-50 p-3 rounded-lg w-full border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">Sending <span className="font-bold">${formData?.amount}</span></p>
                    <p className="text-xs text-gray-500">to {formData?.email}</p>
                </div>

                <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-gray-300" />
                        <InputOTPSlot index={1} className="border-gray-300" />
                        <InputOTPSlot index={2} className="border-gray-300" />
                        <InputOTPSlot index={3} className="border-gray-300" />
                        <InputOTPSlot index={4} className="border-gray-300" />
                        <InputOTPSlot index={5} className="border-gray-300" />
                    </InputOTPGroup>
                </InputOTP>
           </div>

           <DialogFooter className="flex gap-2 sm:justify-between">
             <Button variant="ghost" onClick={() => setShowOtpDialog(false)} className="w-full sm:w-auto">Cancel</Button>
             <Button 
                onClick={onOtpVerify} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                disabled={otpCode.length < 6 || isLoading}
             >
                {isLoading ? <Loader2 className="animate-spin" /> : "Confirm Transfer"}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

    </div>
  );
};

export default P2PForm;