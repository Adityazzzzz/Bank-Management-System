"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ErrorToast({ message }: { message: string }) {
  useEffect(() => {
    // This triggers immediately when the component mounts
    toast.error(message);
  }, [message]);

  return null; // Render nothing visible
}