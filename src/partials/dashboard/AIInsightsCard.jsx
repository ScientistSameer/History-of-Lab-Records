import React from "react";

function AIInsightsCard() {
  return (
    <div className="col-span-12 xl:col-span-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        AI Insights & Recommendations
      </h2>

      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
        <li>📈 Predicted growth in ML research workload next quarter.</li>
        <li>🧪 Increase collaboration between AI Lab & CV Lab improves success rate by 12%.</li>
        <li>⚡ Resource optimization recommended for Cyber Security Lab.</li>
        <li>🤝 3 new collaboration patterns detected using historical data.</li>
      </ul>
    </div>
  );
}

export default AIInsightsCard;
