"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [selected, setSelected] = useState(id || accounts[0]?.appwriteItemId);

  const handleBankChange = (newId: string) => {
    setSelected(newId);
    if (setValue) {
      setValue("senderBank", newId);
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "id",
        value: newId,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <Select value={selected} onValueChange={(value) => handleBankChange(value)}>
      <SelectTrigger className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}>
        <Image src="icons/credit-card.svg" width={20} height={20} alt="account" />
        <p className="line-clamp-1 w-full text-left">
           {accounts.find((account) => account.appwriteItemId === selected)?.name || "Select Account"}
        </p>
      </SelectTrigger>
      
      <SelectContent className={`w-full bg-white md:w-[300px] z-50 ${otherStyles}`} align="end">
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a bank to view
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id} 
              value={account.appwriteItemId}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col ">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-12 font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};