import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";

// Dashboard cards
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard02 from "../partials/dashboard/DashboardCard02";
import DashboardCard03 from "../partials/dashboard/DashboardCard03";
import DashboardCard12 from "../partials/dashboard/DashboardCard12";

// New MVP cards
import LabSummaryCard from "../partials/dashboard/LabSummaryCard";
import ResearchDomainCard from "../partials/dashboard/ResearchDomainCard";
import CollaborationCard from "../partials/dashboard/CollaborationCard";
import AIInsightsCard from "../partials/dashboard/AIInsightsCard";
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";

import Banner from "../partials/Banner";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Lab Analytics Dashboard
                </h1>
              </div>

              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
                <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                  <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="max-xs:sr-only">Add View</span>
                </button>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* MVP cards */}
              <LabSummaryCard />
              <ResearchDomainCard />
              <CollaborationCard />
              <AIInsightsCard />
              <ResearchersOverviewCard />

              {/* Existing cards */}
              <DashboardCard01 />
              <DashboardCard02 />
              <DashboardCard03 />
              <DashboardCard12 />
            </div>

          </div>
        </main>

        <Banner />
      </div>
    </div>
  );
};

export default Dashboard;
