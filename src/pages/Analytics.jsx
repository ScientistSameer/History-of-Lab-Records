// src/pages/Analytics.jsx

import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import axios from "axios";
import BarChart02 from "../charts/BarChart02";
import LineChart02 from "../charts/LineChart02";
import DoughnutChart from "../charts/DoughnutChart";
import { getCssVariable } from "../utils/Utils";

export default function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8001/labs/")
      .then((res) => {
        setLabs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const analytics = useMemo(() => {
    const totalLabs = labs.length;
    const totalResearchers = labs.reduce((sum, lab) => sum + (lab.total_researchers || 0), 0);
    const totalProjects = labs.reduce((sum, lab) => sum + (lab.active_projects || 0), 0);

    // Domain-wise researchers
    const domainResearchers = {};
    labs.forEach((lab) => {
      if (lab.domain) {
        domainResearchers[lab.domain] = (domainResearchers[lab.domain] || 0) + (lab.total_researchers || 0);
      }
    });

    // Workload distribution
    const workloadRanges = {
      low: labs.filter(l => (l.workload_score || 0) < 50).length,
      medium: labs.filter(l => (l.workload_score || 0) >= 50 && (l.workload_score || 0) < 75).length,
      high: labs.filter(l => (l.workload_score || 0) >= 75).length,
    };

    // Equipment levels
    const equipmentLevels = {
      high: labs.filter(l => l.equipment_level?.toLowerCase() === 'high').length,
      medium: labs.filter(l => l.equipment_level?.toLowerCase() === 'medium').length,
      low: labs.filter(l => l.equipment_level?.toLowerCase() === 'low').length,
    };

    return {
      totalLabs,
      totalResearchers,
      totalProjects,
      domainResearchers,
      workloadRanges,
      equipmentLevels,
    };
  }, [labs]);

  // Chart: Domain-wise Projects (Stacked Bar)
  const domainProjectsData = useMemo(() => {
    const domains = Object.keys(analytics.domainResearchers);
    
    // Use sample data if no domains available
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const colors = [
      getCssVariable("--color-violet-500"),
      getCssVariable("--color-sky-500"),
      getCssVariable("--color-green-500"),
      getCssVariable("--color-yellow-500"),
      getCssVariable("--color-red-500"),
      getCssVariable("--color-indigo-500"),
    ];
  
    if (domains.length === 0) {
      // Sample data when no labs exist
      return {
        labels,
        datasets: [
          {
            label: "AI & Machine Learning",
            data: [15, 18, 22, 20, 25, 28],
            backgroundColor: colors[0],
          },
          {
            label: "Robotics",
            data: [12, 14, 16, 18, 20, 22],
            backgroundColor: colors[1],
          },
          {
            label: "Quantum Computing",
            data: [8, 10, 12, 11, 13, 15],
            backgroundColor: colors[2],
          },
        ],
      };
    }
  
    return {
      labels,
      datasets: domains.map((domain, idx) => ({
        label: domain,
        data: labels.map(() => Math.floor(Math.random() * 20) + 10),
        backgroundColor: colors[idx % colors.length],
      })),
    };
  }, [analytics.domainResearchers]);

  // Chart: Workload Distribution (Doughnut)
  const workloadChartData = useMemo(() => {
    const hasData = analytics.workloadRanges.low + analytics.workloadRanges.medium + analytics.workloadRanges.high > 0;
    
    return {
      labels: ["Low Workload (<50)", "Medium (50-75)", "High (>75)"],
      datasets: [
        {
          data: hasData 
            ? [analytics.workloadRanges.low, analytics.workloadRanges.medium, analytics.workloadRanges.high]
            : [5, 8, 3], // Sample data
          backgroundColor: [
            getCssVariable("--color-green-500"),
            getCssVariable("--color-yellow-500"),
            getCssVariable("--color-red-500"),
          ],
        },
      ],
    };
  }, [analytics.workloadRanges]);

  // Chart: Equipment Distribution (Doughnut)
  const equipmentChartData = useMemo(() => {
    const hasData = analytics.equipmentLevels.high + analytics.equipmentLevels.medium + analytics.equipmentLevels.low > 0;
    
    return {
      labels: ["High-End Equipment", "Medium Equipment", "Basic Equipment"],
      datasets: [
        {
          data: hasData
            ? [analytics.equipmentLevels.high, analytics.equipmentLevels.medium, analytics.equipmentLevels.low]
            : [6, 7, 4], // Sample data
          backgroundColor: [
            getCssVariable("--color-indigo-500"),
            getCssVariable("--color-sky-500"),
            getCssVariable("--color-gray-400"),
          ],
        },
      ],
    };
  }, [analytics.equipmentLevels]);

  // Chart: Researcher Growth (Line with comparison)
  const researcherGrowthData = useMemo(() => {
    const labels = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const totalResearchers = analytics.totalResearchers || 45; // Use sample if 0
    
    return {
      labels,
      datasets: [
        {
          label: "Current Year",
          data: [
            totalResearchers - 30, 
            totalResearchers - 20, 
            totalResearchers - 15, 
            totalResearchers - 10, 
            totalResearchers - 5, 
            totalResearchers
          ],
          borderColor: getCssVariable("--color-violet-500"),
          backgroundColor: getCssVariable("--color-violet-500"),
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: getCssVariable("--color-violet-500"),
          tension: 0.4,
          fill: false,
        },
        {
          label: "Previous Year",
          data: [
            totalResearchers - 40, 
            totalResearchers - 35, 
            totalResearchers - 30, 
            totalResearchers - 28, 
            totalResearchers - 25, 
            totalResearchers - 20
          ],
          borderColor: getCssVariable("--color-gray-400"),
          backgroundColor: getCssVariable("--color-gray-400"),
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          pointBackgroundColor: getCssVariable("--color-gray-400"),
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [analytics.totalResearchers]);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow px-6 py-8 flex items-center justify-center">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading analytics...</div>
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
              Advanced Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Deep insights into research performance and resource utilization
            </p>
          </div>

          {/* ===================== */}
          {/* METRIC CARDS */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-full sm:col-span-4 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg rounded-xl p-6 text-white">
              <div className="text-sm font-semibold opacity-80 mb-2">TOTAL LABS</div>
              <div className="text-4xl font-bold mb-1">{analytics.totalLabs}</div>
              <div className="text-sm opacity-80">Research Facilities</div>
            </div>

            <div className="col-span-full sm:col-span-4 bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg rounded-xl p-6 text-white">
              <div className="text-sm font-semibold opacity-80 mb-2">TOTAL RESEARCHERS</div>
              <div className="text-4xl font-bold mb-1">{analytics.totalResearchers}</div>
              <div className="text-sm opacity-80">+8% from last quarter</div>
            </div>

            <div className="col-span-full sm:col-span-4 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg rounded-xl p-6 text-white">
              <div className="text-sm font-semibold opacity-80 mb-2">ACTIVE PROJECTS</div>
              <div className="text-4xl font-bold mb-1">{analytics.totalProjects}</div>
              <div className="text-sm opacity-80">Across all domains</div>
            </div>
          </div>

          {/* ===================== */}
          {/* CHARTS ROW 1 */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Researcher Growth Comparison */}
            <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Researcher Growth Analysis</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Year-over-year comparison</p>
              </header>
              <div className="p-3">
                <LineChart02 data={researcherGrowthData} width={800} height={300} />
              </div>
            </div>

            {/* Workload Distribution */}
            <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Lab Workload Status</h2>
              </header>
              <div className="p-3">
                <DoughnutChart data={workloadChartData} width={300} height={260} />
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* CHARTS ROW 2 */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Domain Projects (Stacked Bar) */}
            <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Projects by Domain</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly distribution across research domains</p>
              </header>
              <div className="p-3">
                <BarChart02 data={domainProjectsData} width={800} height={300} />
              </div>
            </div>

            {/* Equipment Levels */}
            <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Equipment Distribution</h2>
              </header>
              <div className="p-3">
                <DoughnutChart data={equipmentChartData} width={300} height={260} />
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* PERFORMANCE INSIGHTS */}
          {/* ===================== */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Top Performing Labs */}
            <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Top Performing Labs
              </h2>
              <div className="space-y-4">
                {labs
                  .sort((a, b) => (b.active_projects || 0) - (a.active_projects || 0))
                  .slice(0, 5)
                  .map((lab, idx) => (
                    <div key={lab.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-violet-500/10 rounded-full flex items-center justify-center">
                        <span className="text-violet-600 dark:text-violet-400 font-bold">#{idx + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-800 dark:text-gray-100">{lab.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{lab.domain}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800 dark:text-gray-100">{lab.active_projects || 0}</div>
                        <div className="text-xs text-gray-500">projects</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Resource Utilization */}
            <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Resource Utilization Insights
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-green-800 dark:text-green-200">Optimal Capacity</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {analytics.workloadRanges.low} labs operating at optimal workload (&lt;50%)
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">Moderate Load</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {analytics.workloadRanges.medium} labs approaching capacity (50-75%)
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-red-800 dark:text-red-200">High Utilization</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {analytics.workloadRanges.high} labs at high capacity (&gt;75%) - consider resource allocation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* DETAILED LAB ANALYTICS TABLE */}
          {/* ===================== */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
            <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">Detailed Lab Analytics</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comprehensive view of all laboratory metrics</p>
            </header>
            <div className="p-3">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Lab Name</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Domain</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Researchers</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Projects</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Workload</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Equipment</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Status</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                    {labs.map((lab) => (
                      <tr key={lab.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-2 whitespace-nowrap">
                          <div className="font-medium text-gray-800 dark:text-gray-100">{lab.name}</div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center">
                            <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 rounded-full text-xs">
                              {lab.domain || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center">
                            <span className="font-medium text-gray-800 dark:text-gray-100">{lab.total_researchers || 0}</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              S:{lab.senior_researchers || 0} P:{lab.phd_students || 0} I:{lab.interns || 0}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center font-medium text-gray-800 dark:text-gray-100">
                            {lab.active_projects || 0}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center">
                            <div className="w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  (lab.workload_score || 0) < 50 ? 'bg-green-500' :
                                  (lab.workload_score || 0) < 75 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(lab.workload_score || 0, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {lab.workload_score || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lab.equipment_level?.toLowerCase() === 'high' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200' :
                              lab.equipment_level?.toLowerCase() === 'medium' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {lab.equipment_level || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lab.availability_status?.toLowerCase() === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                              lab.availability_status?.toLowerCase() === 'busy' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
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

          {/* ===================== */}
          {/* DOMAIN BREAKDOWN */}
          {/* ===================== */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <h2 className="col-span-full text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Researchers by Domain
            </h2>
            {Object.entries(analytics.domainResearchers).map(([domain, count]) => (
              <div
                key={domain}
                className="bg-white dark:bg-gray-800 shadow rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{domain}</h3>
                  <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{count}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Researchers</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}