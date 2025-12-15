import React from "react";

function LabSummaryCard({ totalLabs }) {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Lab Summary
      </h2>

      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <li>
          <strong>Total Labs:</strong> {totalLabs}
        </li>
      </ul>
    </div>
  );
}

export default LabSummaryCard;
