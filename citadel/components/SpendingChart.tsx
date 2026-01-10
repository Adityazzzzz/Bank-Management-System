"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { countTransactionCategories2 } from "@/lib/utils"; 

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions }: { transactions: any[] }) => {
  const chartInfo = countTransactionCategories2(transactions);
  const data = {
    labels: chartInfo.labels,
    datasets: [
      {
        data: chartInfo.datasets[0].data,
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

  const totalSpend = chartInfo.datasets[0].data.reduce((a, b) => Number(a) + Number(b), 0);

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      
      <div className="flex flex-col gap-2">
        <h2 className="header-2">Monthly Analytics</h2>
        <div className="mt-4 flex items-baseline gap-2">
            <span className="text-30 font-bold text-gray-900">${totalSpend.toFixed(2)}</span>
        </div>
        <p className="text-12 text-gray-400">Total spend across connected accounts</p>
      </div>

      <div className="relative size-[200px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-auto">
        {chartInfo.labels.map((label, index) => (
            <div key={label} className="flex items-center justify-between gap-8 text-14">
                <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full" style={{ backgroundColor: "#0179FE" }} />
                    <span className="text-gray-600 font-medium">{label}</span>
                </div>
                <span className="font-bold text-gray-900">${chartInfo.datasets[0].data[index]}</span>
            </div>
        ))}
      </div>

    </div>
  );
};

export default SpendingChart;