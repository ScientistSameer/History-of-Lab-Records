import React from "react";
import DoughnutChart from "../../charts/DoughnutChart";
import { getCssVariable } from "../../utils/Utils";

export default function AnalyticsByCategoryCard() {
  const data = {
    labels: ["Lab", "Research", "Analytics", "Collaboration"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          getCssVariable("--color-indigo-500"),
          getCssVariable("--color-green-500"),
          getCssVariable("--color-yellow-500"),
          getCssVariable("--color-red-500"),
        ],
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Analytics by Category
      </h2>
      <DoughnutChart data={data} width={200} height={200} />
    </div>
  );
}
