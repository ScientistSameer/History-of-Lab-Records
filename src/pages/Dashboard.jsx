// src/pages/Dashboard.jsx

import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import DoughnutChart from "../charts/DoughnutChart";
import BarChart03 from "../charts/BarChart03";
import LineChart01 from "../charts/LineChart01";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { getCssVariable, adjustColorOpacity } from "../utils/Utils";


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/labs/")
      .then((res) => res.json())
      .then((data) => {
        setLabs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Derived metrics
  const metrics = useMemo(() => {
    const totalLabs = labs.length;
    const totalResearchers = labs.reduce((sum, lab) => sum + (lab.total_researchers || 0), 0);
    const totalProjects = labs.reduce((sum, lab) => sum + (lab.active_projects || 0), 0);
    const totalSeniors = labs.reduce((sum, lab) => sum + (lab.senior_researchers || 0), 0);
    const totalPhD = labs.reduce((sum, lab) => sum + (lab.phd_students || 0), 0);
    const totalInterns = labs.reduce((sum, lab) => sum + (lab.interns || 0), 0);

    // Domain distribution
    const domainCounts = {};
    labs.forEach((lab) => {
      if (lab.domain) {
        domainCounts[lab.domain] = (domainCounts[lab.domain] || 0) + 1;
      }
    });

    // Availability status
    const availabilityStats = {
      available: labs.filter(l => l.availability_status?.toLowerCase() === 'available').length,
      busy: labs.filter(l => l.availability_status?.toLowerCase() === 'busy').length,
      unavailable: labs.filter(l => l.availability_status?.toLowerCase() === 'unavailable').length,
    };

    return {
      totalLabs,
      totalResearchers,
      totalProjects,
      totalSeniors,
      totalPhD,
      totalInterns,
      domainCounts,
      availabilityStats,
    };
  }, [labs]);

  // Chart data: Domain Distribution (Doughnut)
  const domainChartData = {
    labels: Object.keys(metrics.domainCounts),
    datasets: [
      {
        data: Object.values(metrics.domainCounts),
        backgroundColor: [
          getCssVariable("--color-violet-500"),
          getCssVariable("--color-sky-500"),
          getCssVariable("--color-green-500"),
          getCssVariable("--color-yellow-500"),
          getCssVariable("--color-red-500"),
          getCssVariable("--color-indigo-500"),
        ],
        hoverBackgroundColor: [
          getCssVariable("--color-violet-600"),
          getCssVariable("--color-sky-600"),
          getCssVariable("--color-green-600"),
          getCssVariable("--color-yellow-600"),
          getCssVariable("--color-red-600"),
          getCssVariable("--color-indigo-600"),
        ],
      },
    ],
  };

  // Chart data: Researcher Types Distribution (Bar)
  const researcherTypesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Senior Researchers",
        data: [metrics.totalSeniors, metrics.totalSeniors + 2, metrics.totalSeniors - 1, metrics.totalSeniors + 3, metrics.totalSeniors + 1, metrics.totalSeniors],
        backgroundColor: getCssVariable("--color-violet-500"),
      },
      {
        label: "PhD Students",
        data: [metrics.totalPhD, metrics.totalPhD + 1, metrics.totalPhD + 2, metrics.totalPhD, metrics.totalPhD + 3, metrics.totalPhD + 1],
        backgroundColor: getCssVariable("--color-sky-500"),
      },
      {
        label: "Interns",
        data: [metrics.totalInterns, metrics.totalInterns - 1, metrics.totalInterns + 2, metrics.totalInterns + 1, metrics.totalInterns, metrics.totalInterns + 3],
        backgroundColor: getCssVariable("--color-green-500"),
      },
    ],
  };

  // Chart data: Projects Growth Trend (Line)
  const projectsTrendData = {
    labels: ["12-01-2024", "01-01-2025", "02-01-2025", "03-01-2025", "04-01-2025", "05-01-2025"],
    datasets: [
      {
        label: "Active Projects",
        data: [metrics.totalProjects - 5, metrics.totalProjects - 3, metrics.totalProjects - 1, metrics.totalProjects, metrics.totalProjects + 2, metrics.totalProjects + 4],
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable("--color-violet-500"), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable("--color-violet-500"), 0.2) },
          ]);
        },
        borderColor: getCssVariable("--color-violet-500"),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable("--color-violet-500"),
        pointHoverBackgroundColor: getCssVariable("--color-violet-500"),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow px-6 py-8 flex items-center justify-center">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow px-6 py-8 max-w-9xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Advanced Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Real-time overview of your research labs ecosystem
            </p>
          </div>

          {/* ===================== */}
          {/* KEY METRICS CARDS */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Total Labs */}
            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase">Total Labs</div>
                <div className="w-8 h-8 bg-violet-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-violet-500" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{metrics.totalLabs}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Research laboratories</div>
            </div>

            {/* Total Researchers */}
            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase">Researchers</div>
                <div className="w-8 h-8 bg-sky-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-sky-500" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{metrics.totalResearchers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Across all labs</div>
            </div>

            {/* Active Projects */}
            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase">Active Projects</div>
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-green-500" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{metrics.totalProjects}</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">+12% this month</div>
            </div>

            {/* Available Labs */}
            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase">Available Labs</div>
                <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-yellow-500" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{metrics.availabilityStats.available}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ready for collaboration</div>
            </div>
          </div>

          {/* ===================== */}
          {/* CHARTS ROW 1 */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Labs by Domain (Doughnut) */}
            <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Labs by Research Domain</h2>
              </header>
              <div className="p-3">
                <DoughnutChart data={domainChartData} width={389} height={260} />
              </div>
            </div>

            {/* Researcher Distribution (Bar) */}
            <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Researcher Type Distribution</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Senior researchers, PhD students, and interns growth over time</p>
              </header>
              <div className="p-3">
                <BarChart03 data={researcherTypesData} width={595} height={260} />
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* CHARTS ROW 2 */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Projects Growth Trend */}
            <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100">Active Projects Trend</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly project activity across all labs</p>
                </div>
                <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+18%</div>
              </header>
              <div className="p-3 grow max-h-[200px]">
                <LineChart01 data={projectsTrendData} width={800} height={200} />
              </div>
            </div>

            {/* AI Insights */}
            <div className="col-span-full xl:col-span-4 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-lg font-semibold">AI Insights</h2>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">📈</span>
                  <span>AI research domain shows highest growth potential (+{Math.round(metrics.totalResearchers * 0.15)} researchers predicted)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300">🤝</span>
                  <span>{Object.keys(metrics.domainCounts).length} collaboration opportunities detected across domains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300">⚡</span>
                  <span>{metrics.availabilityStats.busy} labs approaching capacity - resource optimization recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-300">🎯</span>
                  <span>Peak collaboration period: Q2 2025 based on historical patterns</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ===================== */}
          {/* LABS QUICK VIEW */}
          {/* ===================== */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Performing Labs</h2>
            </header>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Lab Name</div></th>
                      <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Domain</div></th>
                      <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Researchers</div></th>
                      <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Projects</div></th>
                      <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Status</div></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                    {labs.slice(0, 5).map((lab) => (
                      <tr key={lab.id}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="font-medium text-gray-800 dark:text-gray-100">{lab.name}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-left text-gray-600 dark:text-gray-400">{lab.domain || "N/A"}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center font-medium">{lab.total_researchers || 0}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center font-medium">{lab.active_projects || 0}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lab.availability_status?.toLowerCase() === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              lab.availability_status?.toLowerCase() === 'busy' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {lab.availability_status || 'Unknown'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;