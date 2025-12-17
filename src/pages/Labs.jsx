import { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";

// Dashboard partials
import LabSummaryCard from "../partials/dashboard/LabSummaryCard";
import ResearchDomainCard from "../partials/dashboard/ResearchDomainCard";
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";

import { getLabs, createLabIdentity } from "../api/labs"; // removed createLabProfile
import axios from "axios";

const BACKEND_URL = "http://localhost:8001"; // update if backend runs elsewhere

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Manual form state
  const [form, setForm] = useState({
    lab_name: "",
    domain: "",
    description: "",
  });

  // Document upload state
  const [docFile, setDocFile] = useState(null);
  const [extractedKeywords, setExtractedKeywords] = useState([]);

  // Fetch all labs
  const fetchLabs = async () => {
    setLoading(true);
    const data = await getLabs();
    setLabs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  // Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit manual lab
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create Lab only (identity)
      await createLabIdentity(form);

      alert("Lab created successfully!");

      // Reset form
      setForm({
        lab_name: "",
        domain: "",
        description: "",
      });

      // Refresh dashboard
      fetchLabs();
    } catch (err) {
      console.error(err);
      alert("Failed to create lab");
    }
  };

  // Document upload handler
  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!docFile) return alert("Please select a document");

    const data = new FormData();
    data.append("file", docFile);

    try {
      const res = await axios.post(`${BACKEND_URL}/ingest/document`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExtractedKeywords(res.data.extracted_domains);
    } catch (err) {
      console.error(err);
      alert("Failed to extract keywords");
    }
  };

  if (loading) return <div className="p-6">Loading labs...</div>;

  const totalLabs = labs.length;
  const totalResearchers = labs.reduce(
    (sum, lab) => sum + (lab.researchers_count || 0),
    0
  );

  const domains = {};
  labs.forEach((lab) => {
    domains[lab.domain] = (domains[lab.domain] || 0) + 1;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Labs Dashboard
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              <LabSummaryCard totalLabs={totalLabs} />
              <ResearchDomainCard domains={domains} />
              <ResearchersOverviewCard totalResearchers={totalResearchers} />
            </div>

            {/* Manual Data Ingestion Form */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Add Lab (Manual)</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="lab_name"
                  placeholder="Lab Name"
                  value={form.lab_name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="domain"
                  placeholder="Domain"
                  value={form.domain}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Create Lab
                </button>
              </form>

              {/* Document Upload */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Upload Lab Document</h2>
                <form onSubmit={handleDocUpload} className="flex gap-2">
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={(e) => setDocFile(e.target.files[0])}
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Extract Keywords
                  </button>
                </form>
                {extractedKeywords.length > 0 && (
                  <div className="mt-4">
                    <strong>Extracted Domains:</strong>{" "}
                    {extractedKeywords.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Labs List */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {labs.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                >
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {lab.lab_name}
                  </h3>
                  <p className="text-sm text-gray-500">{lab.domain}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Researchers: {lab.researchers_count || 0}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
