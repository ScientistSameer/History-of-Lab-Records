import React, { useMemo } from "react";
import DoughnutChart from "../../charts/DoughnutChart.jsx";
import { getCssVariable } from "../../utils/Utils.js";

export default function ResearchersByFieldCard() {
  // Safely get CSS colors with fallbacks
  const colors = useMemo(
    () => [
      getCssVariable("--color-indigo-500") || "#6366F1",
      getCssVariable("--color-green-500") || "#10B981",
      getCssVariable("--color-yellow-500") || "#FACC15",
      getCssVariable("--color-red-500") || "#EF4444",
    ],
    []
  );

  const data = useMemo(
    () => ({
      labels: ["Computer Science", "Physics", "Biology", "Chemistry"],
      datasets: [
        {
          data: [12, 8, 5, 10],
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    }),
    [colors]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: getCssVariable("--color-gray-800") || "#111827",
          },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 h-64">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Researchers by Field
      </h2>
      <div className="h-48 w-full">
        {/* Only render chart when window exists to avoid SSR issues */}
        {typeof window !== "undefined" && <DoughnutChart data={data} options={options} />}
      </div>
    </div>
  );
}
