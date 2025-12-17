import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

// Dashboard partials
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";

// Researchers-specific partials
import ResearchersByFieldCard from "../partials/researchers/ResearchersByFieldCard";
import ResearchersActivityChartCard from "../partials/researchers/ResearchersActivityChartCard";
import { getResearchers, getResearchersSummary, createResearcher } from "../api/researchers";

export default function Researchers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [researchers, setResearchers] = useState([]);
  const [summary, setSummary] = useState({ total_researchers: 0, labs: [] });

  // Form state
  const [form, setForm] = useState({
    name: "",
    field: "",
    lab_id: "",
  });

  useEffect(() => {
    fetchResearchers();
  }, []);

  const fetchResearchers = async () => {
    try {
      const res = await getResearchers();
      setResearchers(res);

      const summaryRes = await getResearchersSummary();
      setSummary(summaryRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.lab_id) return alert("Name and Lab are required");

    try {
      await createResearcher(form);
      alert("Researcher added successfully!");
      setForm({ name: "", field: "", lab_id: "" });
      fetchResearchers(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to add researcher");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Researchers Dashboard
            </h1>

            {/* Overview Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              <ResearchersOverviewCard totalResearchers={summary.total_researchers} />
            </div>

            {/* Optional charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              {/* <ResearchersByFieldCard researchers={researchers} /> */}
              <ResearchersActivityChartCard researchers={researchers} />
            </div>

            {/* Add Researcher Form */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Add Researcher</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Researcher Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="field"
                  placeholder="Field"
                  value={form.field}
                  onChange={handleChange}
                />
                <select
                  name="lab_id"
                  value={form.lab_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Lab</option>
                  {summary.labs.map((lab) => (
                    <option key={lab.lab_id} value={lab.lab_id}>{lab.lab_name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Add Researcher
                </button>
              </form>
            </div>

            {/* Labs Summary */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Researchers by Lab</h2>
              <ul className="space-y-2">
                {summary.labs.map((lab) => (
                  <li key={lab.lab_id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                    <strong>{lab.lab_name}</strong>: {lab.researchers_count} researcher(s)
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Researchers List */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">All Researchers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {researchers.map((r) => (
                  <div key={r.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{r.name}</h3>
                    <p className="text-sm text-gray-500">Field: {r.field || "N/A"}</p>
                    <p className="text-sm text-gray-500">Lab ID: {r.lab_id}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
