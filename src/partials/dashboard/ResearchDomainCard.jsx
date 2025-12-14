import React from "react";

function ResearchDomainCard() {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Research Domains Overview
      </h2>

      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <li><strong>Machine Learning:</strong> Productivity Index 82</li>
        <li><strong>Biomedical:</strong> Productivity Index 76</li>
        <li><strong>Cyber Security:</strong> Productivity Index 71</li>
        <li><strong>Blockchain:</strong> Productivity Index 65</li>
      </ul>
    </div>
  );
}

export default ResearchDomainCard;
