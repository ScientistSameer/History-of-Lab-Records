import React from "react";

// Dashboard partials
import LabSummaryCard from "../partials/dashboard/LabSummaryCard";
import ResearchDomainCard from "../partials/dashboard/ResearchDomainCard";
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";

// Labs-specific partials
//import LabsTimelineCard from "../partials/labs/LabsTimelineCard";
//import LabsByStatusCard from "../partials/labs/LabsByStatusCard";

export default function Labs() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Labs Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <LabSummaryCard />
        <ResearchDomainCard />
        <ResearchersOverviewCard />
      </div>

      {/* Labs Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* <LabsByStatusCard />
        <LabsTimelineCard /> */}
      </div>
    </div>
  );
}
