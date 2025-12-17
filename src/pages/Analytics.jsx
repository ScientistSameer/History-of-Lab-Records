import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

// Dashboard / Analytics Cards
import LabSummaryCard from "../partials/dashboard/LabSummaryCard";
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";
import AnalyticsSummaryCard from "../partials/analytics/AnalyticsSummaryCard";

// Charts (you can replace with Chart.js / Recharts)
import { getLabs } from "../api/labs";
import { getResearchers, getResearchersSummary } from "../api/researchers";

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labs, setLabs] = useState([]);
  const [researchers, setResearchers] = useState([]);
  const [summary, setSummary] = useState({ total_researchers: 0, labs: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const labsData = await getLabs();
      setLabs(labsData);

      const resResearchers = await getResearchers();
      setResearchers(resResearchers);

      const resSummary = await getResearchersSummary();
      setSummary(resSummary);
    } catch (err) {
      console.error(err);
    }
  };

  const totalLabs = labs.length;
  const totalResearchers = summary.total_researchers || researchers.length;

  // Count researchers per domain
  const domainCounts = {};
  labs.forEach((lab) => {
    domainCounts[lab.domain] = (domainCounts[lab.domain] || 0) + 
      (summary.labs.find((l) => l.lab_id === lab.id)?.researchers_count || 0);
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Analytics Dashboard
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              <LabSummaryCard totalLabs={totalLabs} />
              <ResearchersOverviewCard totalResearchers={totalResearchers} />
              {/* <AnalyticsSummaryCard domainCounts={domainCounts} /> */}
            </div>

            {/* Labs Details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Labs Details</h2>
              <ul className="space-y-2">
                {labs.map((lab) => {
                  const labSummary = summary.labs.find((l) => l.lab_id === lab.id) || {};
                  return (
                    <li key={lab.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                      <strong>{lab.name}</strong> ({lab.domain || "N/A"}):{" "}
                      {labSummary.researchers_count || 0} researcher(s)  
                      <p className="text-sm text-gray-500">{lab.description || "No description"}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Researchers List */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">All Researchers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {researchers.map((r) => {
                  const labName = labs.find((lab) => lab.id === r.lab_id)?.name || "Unknown Lab";
                  return (
                    <div key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{r.name}</h3>
                      <p className="text-sm text-gray-500">Field: {r.field || "N/A"}</p>
                      <p className="text-sm text-gray-500">Lab: {labName}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analytics by Domain */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Researchers by Domain</h2>
              <ul className="space-y-2">
                {Object.entries(domainCounts).map(([domain, count]) => (
                  <li key={domain} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                    <strong>{domain}</strong>: {count} researcher(s)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
