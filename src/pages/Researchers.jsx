import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import axios from "axios";

/*
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";
import { getResearchers, getResearchersSummary, createResearcher } from "../api/researchers";
*/

export default function Researchers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 ONLY labs state (from labs DB)
  const [labs, setLabs] = useState([]);

  // 🔹 Fetch labs directly
  useEffect(() => {
    axios
      .get("http://localhost:8001/labs/")
      .then((res) => setLabs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow px-6 py-8 max-w-9xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Researchers Dashboard
          </h1>

          {/*
          ===============================
          EVERYTHING ELSE IS TEMP DISABLED
          ===============================
          Overview cards
          Add researcher form
          Researchers list
          Researchers summary API
          */}

          {/* ✅ ONLY SECTION ENABLED */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Researchers by Lab</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {labs.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow"
                >
                  <h3 className="font-semibold mb-2">{lab.name}</h3>

                  <p>Total Researchers: {lab.total_researchers}</p>
                  <p>Senior Researchers: {lab.senior_researchers}</p>
                  <p>PhD Students: {lab.phd_students}</p>
                  <p>Interns: {lab.interns}</p>
                  <p>Active Projects: {lab.active_projects}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
