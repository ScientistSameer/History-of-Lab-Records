import { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { getSuggestions, sendEmail } from "../api/collaboration";

export default function Collaboration() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await getSuggestions();
      setSuggestions(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendEmail = async (suggestion) => {
    setLoading(true);
    try {
      await sendEmail({
        from_lab_id: suggestion.from_lab_id,
        to_lab_id: suggestion.to_lab_id,
      });
      alert("Email sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow p-6">
          <h1 className="text-2xl font-bold mb-6">Collaboration Opportunities</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((s) => (
              <div key={s.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold">{s.from_lab} ↔ {s.to_lab}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Similar domain: <strong>{s.shared_domain}</strong>
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  Potential collaboration in research areas: {s.shared_fields.join(", ")}
                </p>
                <button
                  onClick={() => handleSendEmail(s)}
                  className="bg-green-500 text-white py-1 px-3 rounded"
                  disabled={loading}
                >
                  Send Collaboration Email
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
