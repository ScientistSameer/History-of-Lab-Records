import { useEffect, useState, useMemo } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import DoughnutChart from "../charts/DoughnutChart";
import LineChart01 from "../charts/LineChart01";
import { getCssVariable, adjustColorOpacity } from "../utils/Utils";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { getLabs, createLabIdentity } from "../api/labs";
import axios from "axios";

const BACKEND_URL = "http://localhost:8001";

// Enhanced Lab Card Component
const LabCard = ({ lab, onView, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
      busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
      unavailable: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getWorkloadColor = (score) => {
    if (score < 50) return "bg-green-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-white">
        <h3 className="font-bold text-lg mb-1 truncate">{lab.name}</h3>
        <p className="text-sm opacity-90">{lab.domain || "General Research"}</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {lab.total_researchers || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Researchers</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {lab.active_projects || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {lab.workload_score || 0}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Workload</div>
          </div>
        </div>

        {lab.workload_score !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Capacity</span>
              <span>{100 - lab.workload_score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`${getWorkloadColor(lab.workload_score)} h-2 rounded-full transition-all`}
                style={{ width: `${Math.min(100 - lab.workload_score, 100)}%` }}
              />
            </div>
          </div>
        )}

        {lab.availability_status && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lab.availability_status)}`}>
              {lab.availability_status}
            </span>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {lab.equipment_level && (
            <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full">
              🔧 {lab.equipment_level}
            </span>
          )}
          {lab.funding_level && (
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
              💰 {lab.funding_level}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onView(lab)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(lab)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(lab)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

const updateLabBackend = async (labId, labData) => {
  const res = await fetch(`http://localhost:8001/labs/${labId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(labData),
  });
  if (!res.ok) throw new Error("Failed to update lab");
  return await res.json();
};

const deleteLabBackend = async (labId) => {
  const res = await fetch(`http://localhost:8001/labs/${labId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete lab");
  return await res.json();
};

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddLab, setShowAddLab] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewLab, setViewLab] = useState(null);
  const [editingLab, setEditingLab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const initialForm = {
    name: "",
    description: "",
    domain: "",
    sub_domains: "",
    lab_type: "",
    email: "",
    website: "",
    country: "",
    city: "",
    institute: "",
    total_researchers: 0,
    active_projects: 0,
    max_project_capacity: 0,
    workload_score: 0,
    availability_status: "",
    senior_researchers: 0,
    phd_students: 0,
    interns: 0,
    equipment_level: "",
    computing_resources: "",
    funding_level: "",
    collaboration_interests: "",
    preferred_domains: "",
  };

  const [form, setForm] = useState(initialForm);
  const [docFile, setDocFile] = useState(null);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const data = await getLabs();
      setLabs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load labs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const analytics = useMemo(() => {
    const totalLabs = labs.length;
    const totalResearchers = labs.reduce((sum, lab) => sum + (lab.total_researchers || 0), 0);
    const totalProjects = labs.reduce((sum, lab) => sum + (lab.active_projects || 0), 0);
    
    const domainCounts = {};
    labs.forEach((lab) => {
      if (lab.domain) {
        domainCounts[lab.domain] = (domainCounts[lab.domain] || 0) + 1;
      }
    });

    const statusCounts = {
      available: labs.filter(l => l.availability_status?.toLowerCase() === 'available').length,
      busy: labs.filter(l => l.availability_status?.toLowerCase() === 'busy').length,
      unavailable: labs.filter(l => l.availability_status?.toLowerCase() === 'unavailable').length,
    };

    const researcherBreakdown = {
      senior: labs.reduce((sum, lab) => sum + (lab.senior_researchers || 0), 0),
      phd: labs.reduce((sum, lab) => sum + (lab.phd_students || 0), 0),
      interns: labs.reduce((sum, lab) => sum + (lab.interns || 0), 0),
    };

    return { totalLabs, totalResearchers, totalProjects, domainCounts, statusCounts, researcherBreakdown };
  }, [labs]);

  const filteredLabs = useMemo(() => {
    return labs.filter(lab => {
      const matchesSearch = lab.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lab.domain?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain = filterDomain === "all" || lab.domain === filterDomain;
      const matchesStatus = filterStatus === "all" || lab.availability_status?.toLowerCase() === filterStatus;
      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [labs, searchQuery, filterDomain, filterStatus]);

  const domainChartData = {
    labels: Object.keys(analytics.domainCounts).length > 0 
      ? Object.keys(analytics.domainCounts)
      : ["AI & ML", "Robotics", "Bioinformatics"],
    datasets: [{
      data: Object.keys(analytics.domainCounts).length > 0
        ? Object.values(analytics.domainCounts)
        : [8, 5, 3],
      backgroundColor: [
        getCssVariable("--color-violet-500"),
        getCssVariable("--color-sky-500"),
        getCssVariable("--color-green-500"),
        getCssVariable("--color-yellow-500"),
        getCssVariable("--color-red-500"),
      ],
    }],
  };

  const statusChartData = {
    labels: ["Available", "Busy", "Unavailable"],
    datasets: [{
      data: [
        analytics.statusCounts.available || 5,
        analytics.statusCounts.busy || 8,
        analytics.statusCounts.unavailable || 3,
      ],
      backgroundColor: [
        getCssVariable("--color-green-500"),
        getCssVariable("--color-yellow-500"),
        getCssVariable("--color-red-500"),
      ],
    }],
  };

  const researcherTrendData = {
    labels: ['01-01-2024', '02-01-2024', '03-01-2024', '04-01-2024', '05-01-2024', '06-01-2024'],
    datasets: [{
      label: "Total Researchers",
      data: [
        Math.max(analytics.totalResearchers - 25, 10),
        Math.max(analytics.totalResearchers - 18, 15),
        Math.max(analytics.totalResearchers - 12, 20),
        Math.max(analytics.totalResearchers - 6, 25),
        Math.max(analytics.totalResearchers - 3, 30),
        analytics.totalResearchers || 45,
      ],
      fill: true,
      backgroundColor: function(context) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        return chartAreaGradient(ctx, chartArea, [
          { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
          { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
        ]);
      },
      borderColor: getCssVariable('--color-violet-500'),
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: getCssVariable('--color-violet-500'),
      tension: 0.4,
    }],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLab) {
        const updatedLab = await updateLabBackend(editingLab.id, form);
        setLabs(labs.map((lab) => lab.id === editingLab.id ? updatedLab : lab));
        alert(`Lab "${form.name}" updated successfully!`);
        setEditingLab(null);
      } else {
        const newLab = await createLabIdentity(form);
        alert(`Lab "${form.name}" added successfully!`);
        setLabs([newLab, ...labs]);
      }
      setForm(initialForm);
      setShowAdvanced(false);
      setShowAddLab(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save lab");
    }
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!docFile) return alert("Please select a document");

    const data = new FormData();
    data.append("file", docFile);

    try {
      const res = await axios.post(`${BACKEND_URL}/ingest/document`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extracted = res.data.extracted_lab || {};
      setForm((prev) => ({ ...prev, ...extracted }));

      const advancedKeys = [
        "website", "country", "city", "institute", "lab_type",
        "availability_status", "max_project_capacity", "workload_score",
        "senior_researchers", "phd_students", "interns",
        "equipment_level", "computing_resources", "funding_level", "preferred_domains",
      ];

      if (advancedKeys.some((k) => extracted[k])) {
        setShowAdvanced(true);
      }

      alert("Lab details extracted. Please review before submission.");
    } catch (err) {
      console.error(err);
      alert("Failed to extract lab details");
    }
  };

  const handleView = (lab) => setViewLab(lab);
  const handleEdit = (lab) => {
    setForm(lab);
    setEditingLab(lab);
    setShowAddLab(true);
    setShowAdvanced(true);
  };
  const handleDelete = async (lab) => {
    if (window.confirm(`Are you sure you want to delete ${lab.name}?`)) {
      try {
        await deleteLabBackend(lab.id);
        setLabs(labs.filter((l) => l.id !== lab.id));
        alert(`Lab "${lab.name}" deleted!`);
      } catch (err) {
        alert("Failed to delete lab");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="grow px-6 py-8 flex items-center justify-center">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading labs...</div>
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
              Laboratory Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive overview and management of research laboratories
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold opacity-80">TOTAL LABS</div>
                <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.totalLabs}</div>
              <div className="text-sm opacity-80">Research Laboratories</div>
            </div>

            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold opacity-80">RESEARCHERS</div>
                <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.totalResearchers}</div>
              <div className="text-sm opacity-80">
                S:{analytics.researcherBreakdown.senior} P:{analytics.researcherBreakdown.phd} I:{analytics.researcherBreakdown.interns}
              </div>
            </div>

            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold opacity-80">ACTIVE PROJECTS</div>
                <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.totalProjects}</div>
              <div className="text-sm opacity-80">Across All Labs</div>
            </div>

            <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold opacity-80">AVAILABLE</div>
                <svg className="w-8 h-8 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-1">{analytics.statusCounts.available}</div>
              <div className="text-sm opacity-80">Ready for Collaboration</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Labs by Domain</h2>
              </header>
              <div className="p-3">
                <DoughnutChart data={domainChartData} width={300} height={260} />
              </div>
            </div>

            <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Availability Status</h2>
              </header>
              <div className="p-3">
                <DoughnutChart data={statusChartData} width={300} height={260} />
              </div>
            </div>

            <div className="col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Growth Trend</h2>
              </header>
              <div className="grow max-h-[260px]">
                <LineChart01 data={researcherTrendData} width={300} height={260} />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Search labs by name or domain..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <option value="all">All Domains</option>
                  {Object.keys(analytics.domainCounts).map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>

                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1 rounded ${viewMode === "table" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {!showAddLab && (
                  <button
                    onClick={() => {
                      setShowAddLab(true);
                      setEditingLab(null);
                      setForm(initialForm);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Lab
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAddLab && (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {editingLab ? "Edit Laboratory" : "Add New Laboratory"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddLab(false);
                    setEditingLab(null);
                    setForm(initialForm);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lab Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Research Domain *</label>
                    <input type="text" name="domain" value={form.domain} onChange={handleChange} required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Researchers *</label>
                    <input type="number" name="total_researchers" value={form.total_researchers} onChange={handleChange} required min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collaboration Interests *</label>
                    <input type="text" name="collaboration_interests" value={form.collaboration_interests} onChange={handleChange} required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sub-domains</label>
                    <input type="text" name="sub_domains" value={form.sub_domains} onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Active Projects</label>
                    <input type="number" name="active_projects" value={form.active_projects} onChange={handleChange} min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="font-medium mb-2 block text-gray-700 dark:text-gray-300">
                    Do you want to provide additional lab details?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" checked={!showAdvanced} onChange={() => setShowAdvanced(false)} className="mr-2" />
                      No, basic details only
                    </label>
                    <label className="flex items-center">
                      <input type="radio" checked={showAdvanced} onChange={() => setShowAdvanced(true)} className="mr-2" />
                      Yes, provide full lab profile
                    </label>
                  </div>
                </div>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {["website", "country", "city", "institute", "lab_type", "availability_status", "equipment_level", "computing_resources", "funding_level", "preferred_domains"].map(name => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                          {name.replace(/_/g, " ")}
                        </label>
                        <input type="text" name={name} value={form[name]} onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                      </div>
                    ))}
                    {["max_project_capacity", "workload_score", "senior_researchers", "phd_students", "interns"].map(name => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                          {name.replace(/_/g, " ")}
                        </label>
                        <input type="number" name={name} value={form[name]} onChange={handleChange} min="0"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                  {editingLab ? "Update Lab" : "Add Lab"}
                </button>
              </form>

              {!editingLab && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Upload Lab Document</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Upload a document to auto-extract lab information</p>
                    <form onSubmit={handleDocUpload} className="flex gap-2">
                      <input type="file" accept=".txt,.docx,.pdf" onChange={(e) => setDocFile(e.target.files[0])}
                        className="flex-1 text-sm text-gray-800 dark:text-gray-100" />
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Extract & Prefill
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Labs Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLabs.map((lab) => (
                <LabCard key={lab.id} lab={lab} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Lab Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Domain</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Researchers</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Projects</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredLabs.map((lab) => (
                      <tr key={lab.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{lab.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{lab.domain}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-800 dark:text-gray-100">{lab.total_researchers || 0}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-800 dark:text-gray-100">{lab.active_projects || 0}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${lab.availability_status === 'available' ? 'bg-green-100 text-green-800' : lab.availability_status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {lab.availability_status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <button onClick={() => handleView(lab)} className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                          <button onClick={() => handleEdit(lab)} className="text-yellow-600 hover:text-yellow-800 mr-3">Edit</button>
                          <button onClick={() => handleDelete(lab)} className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredLabs.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No labs found matching your criteria
            </div>
          )}

          {/* View Modal */}
          {viewLab && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{viewLab.name}</h2>
                  <button onClick={() => setViewLab(null)} className="text-white hover:bg-white/20 rounded-full p-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(viewLab).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                          {key.replace(/_/g, " ")}
                        </div>
                        <div className="text-base text-gray-800 dark:text-gray-100">
                          {value !== null && value !== undefined && value !== "" ? String(value) : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}