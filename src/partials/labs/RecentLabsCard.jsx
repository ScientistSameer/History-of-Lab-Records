import React from "react";

export default function RecentLabsCard() {
  const recentLabs = [
    { name: "AI Lab: Image Recognition", status: "Active" },
    { name: "Robotics Lab: Autonomous Vehicles", status: "Completed" },
    { name: "Bioinformatics Lab: Genome Analysis", status: "Active" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent Labs
      </h3>
      <ul className="space-y-2">
        {recentLabs.map((lab, idx) => (
          <li
            key={idx}
            className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between"
          >
            <span>{lab.name}</span>
            <span
              className={`text-sm ${
                lab.status === "Active"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {lab.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}