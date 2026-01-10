"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {  calculateGrowth, countTransactionCategories2 } from "@/lib/utils";
import NewTransactionForm from "./NewTransactionForm";
import { TrendingDown, TrendingUp } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions, userId }: { transactions: any[], userId: string }) => {
  const chartInfo = countTransactionCategories2(transactions);
  const { currentMonthTotal, growth } = calculateGrowth(transactions);
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
      
      <div className="flex flex-col gap-4">
        <div>
            <h2 className="header-2">Monthly Analytics</h2>
            <p className="text-12 text-gray-400">Spending Overview</p>
        </div>

        <div className="flex items-baseline gap-3">
            <span className="text-30 font-bold text-gray-900">${totalSpend.toFixed(2)}</span>
            <div className={`flex items-center gap-1 text-12 font-medium px-2 py-0.5 rounded-full ${growth > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {growth > 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                <span>{Math.abs(growth).toFixed(1)}% vs last month</span>
            </div>
        </div>
        
        <NewTransactionForm userId={userId} />
      </div>

      <div className="relative size-[180px] flex items-center justify-center">
        {hasData ? (
            <Doughnut data={data} options={options} />
        ) : (
            <div className="flex flex-col items-center justify-center text-center">
                <div className="size-32 rounded-full border-4 border-gray-100 flex items-center justify-center bg-gray-50">
                    <p className="text-xs text-gray-400 font-medium px-2">No expenses yet</p>
                </div>
            </div>
        )}
      </div>
      <div className="flex flex-col gap-3 w-full lg:w-auto">
        {hasData ? (
            chartInfo.labels.slice(0, 4).map((label, index) => (
                <div key={label} className="flex items-center justify-between gap-8 text-14">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: "#0179FE" }} />
                        <span className="text-gray-600 font-medium">{label}</span>
                    </div>
                    {/* Safe access to data array */}
                    <span className="font-bold text-gray-900">
                        ${chartInfo.datasets[0].data[index]?.toFixed(0)}
                    </span>
                </div>
            ))
        ) : (
             <p className="text-sm text-gray-400 italic">Add a transaction to see analytics.</p>
        )}
      </div>
    </div>
  );
};

export default SpendingChart;