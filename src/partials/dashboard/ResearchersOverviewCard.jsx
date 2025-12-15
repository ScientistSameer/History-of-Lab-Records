import React from "react";

function ResearchersOverviewCard({ totalResearchers }) {
  return (
    <div className="col-span-12 xl:col-span-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Researchers Overview
      </h2>

      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <li>
          <strong>Total Researchers:</strong> {totalResearchers}
        </li>
      </ul>
    </div>
  );
}

export default ResearchersOverviewCard;
