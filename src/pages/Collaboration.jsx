import React, { useState } from "react";

const collaborations = [
  {
    id: 1,
    labs: "AI Lab ↔ Computer Vision Lab",
    description: "Similar domain, matching workload & expertise",
    email: "cvlab@example.com",
  },
  {
    id: 2,
    labs: "Bioinformatics Lab ↔ Genetics Lab",
    description: "Cross-disciplinary collaboration on genome analysis",
    email: "geneticslab@example.com",
  },
  {
    id: 3,
    labs: "Robotics Lab ↔ Mechanical Design Lab",
    description: "Joint project on automation & prototyping",
    email: "roboticslab@example.com",
  },
];

export default function Collaboration() {
  const [selectedCollab, setSelectedCollab] = useState(null);

  const handleGenerateEmail = (collab) => {
    setSelectedCollab(collab);
    const subject = encodeURIComponent(`Collaboration Opportunity: ${collab.labs}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in collaborating with your team on "${collab.labs}". Please let me know how we can proceed.\n\nBest regards,`
    );

    window.location.href = `mailto:${collab.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="px-6 py-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Collaboration Opportunities
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {collaborations.map((collab) => (
          <div
            key={collab.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {collab.labs}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {collab.description}
            </p>
            <button
              onClick={() => handleGenerateEmail(collab)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generate Collaboration Email
            </button>
          </div>
        ))}
      </div>

      {selectedCollab && (
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-gray-800 dark:text-gray-100">
          <h4 className="font-semibold mb-2">Selected Collaboration:</h4>
          <p>{selectedCollab.labs}</p>
        </div>
      )}
    </div>
  );
}
