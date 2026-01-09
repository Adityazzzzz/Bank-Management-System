"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPot } from "@/lib/actions/savings.actions";
import { useRouter } from "next/navigation";

const NewPotForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const target = formData.get("target") as string;

    if (name && target) {
      await createPot({ userId, name, targetAmount: Number(target) });
      setOpen(false); // Close dialog
      router.refresh(); // Refresh page to show new pot
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create a Savings Goal</DialogTitle>
          <DialogDescription>
            What are you saving for? Set a target and start funding it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Goal Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. New Laptop"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Target ($)
            </Label>
            <Input
              id="target"
              name="target"
              type="number"
              placeholder="1000"
              className="col-span-3"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white">
            {isLoading ? "Creating..." : "Create Pot"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPotForm;