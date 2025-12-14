import React from "react";

function ResearchersOverviewCard() {
  return (
    <div className="col-span-12 xl:col-span-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Researchers Overview
      </h2>

      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <li><strong>Total Researchers:</strong> 82</li>
        <li><strong>High Workload (30+ hrs/week):</strong> 21</li>
        <li><strong>Available for New Projects:</strong> 34</li>
        <li><strong>Top Performer:</strong> Dr. Sara Malik (92 Productivity Index)</li>
      </ul>
    </div>
  );
}

export default ResearchersOverviewCard;
