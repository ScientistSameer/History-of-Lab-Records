import React from "react";
import LineChart01 from "../../charts/LineChart01";
import { chartAreaGradient } from "../../charts/ChartjsConfig";
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";

export default function AnalyticsTrendsChartCard() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Activity",
        data: [120, 200, 150, 220, 170, 250],
        fill: true,
        backgroundColor: function (context) {
          const { ctx, chartArea } = context.chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable("--color-indigo-500"), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable("--color-indigo-500"), 0.2) },
          ]);
        },
        borderColor: getCssVariable("--color-indigo-500"),
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Activity Trends
      </h2>
      <LineChart01 data={data} width={400} height={150} />
    </div>
  );
}
