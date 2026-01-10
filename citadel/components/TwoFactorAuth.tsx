"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2, Copy, Smartphone, CheckCircle2, X } from "lucide-react";
import { get2FASecret, activate2FA } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TwoFactorAuth = ({ user }: { user: any }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1=Intro, 2=Scan, 3=Success
  const [secret, setSecret] = useState<any>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onEnableClick = async () => {
    setIsLoading(true);
    try {
        const data = await get2FASecret();
        if(data) {
            setSecret(data);
            setStep(2);
        } else {
            toast.error("Could not initiate 2FA. Already enabled?");
        }
    } catch (e) {
        toast.error("Failed to start 2FA");
    } finally {
        setIsLoading(false);
    }
  };

  const onVerifyClick = async () => {
    if(code.length !== 6) return;
    setIsLoading(true);
    try {
        await activate2FA({ code, secret: secret.secret });
        setStep(3);
        toast.success("2-Factor Authentication Enabled!");
    } catch (e) {
        toast.error("Invalid Code. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret.secret);
    toast.success("Secret key copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`flex gap-2 items-center ${user.mfaEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            <ShieldCheck size={18} />
            {user.mfaEnabled ? "2FA Active" : "Enable 2FA"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-white p-0 overflow-hidden gap-0 rounded-2xl">
        {/* CUSTOM HEADER */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
           <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
             <ShieldCheck className="text-blue-600" size={20} /> Security
           </DialogTitle>
           <X className="h-4 w-4 text-gray-400 cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        <div className="p-6">
            {step === 1 && (
                <div className="flex flex-col gap-6 text-center pt-2 pb-4">
                    <div className="mx-auto bg-blue-100 p-4 rounded-full text-blue-600">
                        <Smartphone size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Secure your account</h3>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                            Two-factor authentication adds an extra layer of security. You'll need a code from Google Authenticator to log in.
                        </p>
                    </div>
                    <Button onClick={onEnableClick} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 shadow-md">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Set up 2FA"}
                    </Button>
                </div>
            )}

            {step === 2 && secret && (
                <div className="flex flex-col gap-5">
                    {/* STEP 1: SCAN */}
                    <div className="flex flex-col items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-12 font-bold text-gray-500 uppercase tracking-wider">Step 1: Scan QR Code</p>
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                            <QRCodeSVG value={secret.uri} size={160} />
                        </div>
                    </div>

                    {/* MANUAL ENTRY FALLBACK */}
                    <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Can't scan the code?</p>
                        <button 
                           onClick={copyToClipboard}
                           className="flex items-center justify-center gap-2 w-full text-xs font-mono bg-gray-100 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <span className="truncate max-w-[200px]">{secret.secret}</span>
                            <Copy size={12} />
                        </button>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    {/* STEP 2: VERIFY */}
                    <div className="space-y-3">
                        <p className="text-12 font-bold text-gray-500 uppercase tracking-wider text-center">Step 2: Enter Code</p>
                        <div className="flex justify-center">
                            <Input 
                                value={code} 
                                onChange={(e) => {
                                    if(e.target.value.length <= 6) setCode(e.target.value)
                                }}
                                placeholder="000 000" 
                                className="text-center text-24 font-bold tracking-[0.5em] w-[200px] h-12 border-gray-300 focus:ring-blue-500"
                            />
                        </div>
                        <Button 
                            onClick={onVerifyClick} 
                            disabled={isLoading || code.length < 6} 
                            className="w-full bg-black text-white hover:bg-gray-800"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Activate"}
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center py-6 gap-4 text-center animate-in fade-in zoom-in">
                    <div className="size-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">2FA Enabled!</h3>
                        <p className="text-sm text-gray-500 mt-1">Your account is now more secure.</p>
                    </div>
                    <Button onClick={() => setIsOpen(false)} className="mt-4 w-full bg-gray-900 text-white">
                        Done
                    </Button>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuth;