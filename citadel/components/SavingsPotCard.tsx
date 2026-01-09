"use client"
import { Progress } from "@/components/ui/progress"
import { formatAmount } from "@/lib/utils"
import { Button } from "./ui/button"
import { fundPot } from "@/lib/actions/savings.actions"

const SavingsPotCard = ({ pot }: { pot: any }) => {
  const percentage = (pot.currentAmount / pot.targetAmount) * 100;

  const handleDeposit = async () => {
      await fundPot(pot.$id, 100, pot.currentAmount);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
            <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                💰
            </div>
            <h3 className="text-16 font-semibold text-gray-900">{pot.name}</h3>
        </div>
        <p className="text-14 font-semibold text-blue-600">{percentage.toFixed(0)}%</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-12 font-medium text-gray-600">
             <span className="font-semibold text-gray-900">{formatAmount(pot.currentAmount)}</span>
             <span>Target: {formatAmount(pot.targetAmount)}</span>
        </div>
        <Progress value={percentage} className="h-2 bg-gray-100"  />
      </div>

      <Button onClick={handleDeposit} className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-none">
          + Add $100
      </Button>
    </div>
  )
}

export default SavingsPotCard;