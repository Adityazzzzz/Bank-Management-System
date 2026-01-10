"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ErrorToast({ message }: { message: string }) {
  useEffect(() => {
    toast.error(message);
  }, [message]);

  return null; 
}