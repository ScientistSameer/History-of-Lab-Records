import React from "react";

function CollaborationCard() {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Collaboration Opportunities
      </h2>

      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
        <li>
          <strong>AI Lab</strong> → <span className="text-violet-500">Computer Vision Lab</span>  
          <div className="text-xs text-gray-500">Match score: 92%</div>
        </li>
        <li>
          <strong>Bioinformatics Lab</strong> → <span className="text-violet-500">Genomics Lab</span>
          <div className="text-xs text-gray-500">Match score: 88%</div>
        </li>
        <li>
          <strong>Cyber Security Lab</strong> → <span className="text-violet-500">Network Systems Lab</span>
          <div className="text-xs text-gray-500">Match score: 81%</div>
        </li>
      </ul>
    </div>
  );
}

export default CollaborationCard;
