import React from "react";
import LineChart01 from "../../charts/LineChart01";
import { chartAreaGradient } from "../../charts/ChartjsConfig";
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";

export default function ResearchersActivityChartCard() {
  const indigoColor = getCssVariable("--color-indigo-500") || "#6366F1";

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Research Publications",
        data: [5, 7, 3, 8, 6, 9],
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null; // prevent crash on first render
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(indigoColor, 0) },
            { stop: 1, color: adjustColorOpacity(indigoColor, 0.2) },
          ]);
        },
        borderColor: indigoColor,
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 h-60">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Researcher Activity
      </h2>
      <div className="h-48">
        <LineChart01 data={data} />
      </div>
    </div>
  );
}
