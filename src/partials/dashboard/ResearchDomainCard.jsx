import React from "react";

function ResearchDomainCard({ domains }) {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Research Domains Overview
      </h2>

      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        {Object.entries(domains).map(([domain, count]) => (
          <li key={domain}>
            <strong>{domain}:</strong> {count} Lab(s)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResearchDomainCard;
