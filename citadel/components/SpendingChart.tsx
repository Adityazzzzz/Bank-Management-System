"use client";

import { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { countTransactionCategories2, calculateGrowth } from "@/lib/utils";
import NewTransactionForm from "./NewTransactionForm";
import { TrendingDown, TrendingUp, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InfoTooltip from "./InfoTooltip";

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions, userId }: { transactions: any[], userId: string }) => {
  // Generate last 6 months for the dropdown
  const months = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const value = `${d.getMonth()}-${d.getFullYear()}`; // e.g. "0-2026" for Jan 2026
        const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
        result.push({ value, label });
    }
    return result;
  }, []);

  const currentMonthValue = `${new Date().getMonth()}-${new Date().getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthValue);
  const filteredTransactions = useMemo(() => {
    const [month, year] = selectedMonth.split('-').map(Number);
    return transactions.filter(t => {
        const dateString = t.date || t.$createdAt;
        const tDate = new Date(dateString);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
    });
  }, [selectedMonth, transactions]);

  const chartInfo = countTransactionCategories2(filteredTransactions);
  const { growth } = calculateGrowth(transactions);

  const hasData = chartInfo.datasets && chartInfo.datasets[0] && chartInfo.datasets[0].data.length > 0;
  
  const totalSpend = hasData 
    ? chartInfo.datasets[0].data.reduce((a, b) => Number(a) + Number(b), 0) 
    : 0;

  const data = {
    labels: chartInfo.labels,
    datasets: [
      {
        data: hasData ? chartInfo.datasets[0].data : [],
        backgroundColor: ["#0179FE", "#4893FF", "#85B7FF", "#BED9FF", "#E9F2FF"], 
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "60%",
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 min-w-[200px]">
        <div className="flex items-center justify-between">
            <h2 className="header-2 flex gap-2">
              Monthly Analytics
              <InfoTooltip content="This chart visualizes your spending habits. Use it to track which categories (Food, Travel, etc.) are consuming most of your budget." />
            </h2>
        </div>
        <div className="w-full">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 h-8 text-12 font-medium">
                    <Calendar className="mr-2 h-3 w-3" />
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-baseline gap-3 mt-2">
            <span className="text-30 font-bold text-gray-900">${totalSpend.toFixed(2)}</span>
        </div>
        {selectedMonth === currentMonthValue && (
            <div className={`flex items-center gap-1 text-12 font-medium px-2 py-0.5 rounded-full w-fit ${growth >= 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {growth >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                <span>{Math.abs(growth).toFixed(1)}% vs last month</span>
            </div>
        )}
        
        <div className="mt-2">
            <NewTransactionForm userId={userId} />
        </div>
      </div>

      <div className="relative size-[180px] flex items-center justify-center shrink-0">
        {hasData ? (
            <Doughnut data={data} options={options} />
        ) : (
            <div className="flex flex-col items-center justify-center text-center">
                <div className="size-32 rounded-full border-4 border-gray-100 flex items-center justify-center bg-gray-50">
                    <p className="text-xs text-gray-400 font-medium px-2">No data</p>
                </div>
            </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-auto min-w-[150px]">
        {hasData ? (
            chartInfo.labels.slice(0, 4).map((label, index) => (
                <div key={label} className="flex items-center justify-between gap-8 text-14">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: "#0179FE" }} />
                        <span className="text-gray-600 font-medium">{label}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                        ${chartInfo.datasets[0].data[index]?.toFixed(0)}
                    </span>
                </div>
            ))
        ) : (
             <p className="text-sm text-gray-400 italic">No expenses found for this month.</p>
        )}
      </div>
    </div>
  );
};

export default SpendingChart;