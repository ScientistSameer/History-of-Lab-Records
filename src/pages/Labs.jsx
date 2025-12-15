import { useEffect, useState } from "react";
import { getLabs } from "../api/labs";

// Dashboard partials
import LabSummaryCard from "../partials/dashboard/LabSummaryCard";
import ResearchDomainCard from "../partials/dashboard/ResearchDomainCard";
import ResearchersOverviewCard from "../partials/dashboard/ResearchersOverviewCard";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLabs()
      .then(setLabs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading labs...</div>;
  }

  // Derived stats for cards
  const totalLabs = labs.length;
  const totalResearchers = labs.reduce(
    (sum, lab) => sum + (lab.researcher_count || 0),
    0
  );

  const domains = {};
  labs.forEach((lab) => {
    domains[lab.domain] = (domains[lab.domain] || 0) + 1;
  });

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Labs Dashboard
      </h1>

      {/* Summary Cards (LIVE DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <LabSummaryCard totalLabs={totalLabs} />
        <ResearchDomainCard domains={domains} />
        <ResearchersOverviewCard totalResearchers={totalResearchers} />
      </div>

      {/* Labs List */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {lab.name}
            </h3>
            <p className="text-sm text-gray-500">{lab.domain}</p>
            <p className="text-xs text-gray-400 mt-1">
              Researchers: {lab.researcher_count || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
