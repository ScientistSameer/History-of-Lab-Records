import React from "react";

// Dashboard partials
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";
import ResearchDomainCard from "../partials/dashboard/ResearchDomainCard";

// Researchers-specific partials (create new ones in /partials/researchers if needed)
import ResearchersByFieldCard from "../partials/researchers/ResearchersByFieldCard";
import ResearchersActivityChartCard from "../partials/researchers/ResearchersActivityChartCard";

export default function Researchers() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Researchers Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <ResearchersOverviewCard />
        <ResearchDomainCard />
      </div>

      {/* Charts & Detailed Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* <ResearchersByFieldCard /> */}
        <ResearchersActivityChartCard />
      </div>
    </div>
  );
}
