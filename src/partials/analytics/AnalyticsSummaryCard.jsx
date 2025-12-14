import React from "react";

export default function AnalyticsSummaryCard() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Total Analytics
      </h2>
      <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        1,245
      </div>
      <div className="text-sm font-medium text-green-600 mt-1">+12% from last month</div>
    </div>
  );
}
