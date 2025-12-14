import React from "react";

// Dashboard partials
import ResearchDomainCard from "../partials/dashboard/ResearchDomainCard";
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";
import LabSummaryCard from "../partials/dashboard/LabSummaryCard";

// Analytics-specific partials (create these in /partials/analytics)
import AnalyticsSummaryCard from "../partials/analytics/AnalyticsSummaryCard";
import AnalyticsTrendsChartCard from "../partials/analytics/AnalyticsTrendsChartCard";
import AnalyticsByCategoryCard from "../partials/analytics/AnalyticsByCategoryCard";

export default function Analytics() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <AnalyticsSummaryCard />
        <LabSummaryCard />
        <ResearchersOverviewCard />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* <AnalyticsTrendsChartCard /> */}
        {/* <AnalyticsByCategoryCard /> */}
      </div>
    </div>
  );
}
