import { useEffect, useState } from "react";
import { getSuggestions, generateEmail } from "../api/collaboration";
import { apiFetch } from "../api/client";

export default function Collaboration() {
  const [suggestions, setSuggestions] = useState([]);
  const [emailPreview, setEmailPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSuggestions().then(setSuggestions);
  }, []);

  const handleGenerateEmail = async (suggestion) => {
    setLoading(true);
    try {
      const res = await generateEmail({
        from_lab_id: suggestion.from_lab_id,
        to_lab_id: suggestion.to_lab_id,
      });
      setEmailPreview(res);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    await apiFetch("/emails", {
      method: "POST",
      body: JSON.stringify(emailPreview),
    });

    alert("Email saved successfully");
    setEmailPreview(null);
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Collaboration Opportunities
      </h1>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="font-semibold">
              {s.from_lab} ↔ {s.to_lab}
            </h3>
            <p className="text-sm text-gray-500">
              Similar domain & expertise
            </p>

            <button
              onClick={() => handleGenerateEmail(s)}
              className="btn mt-3"
              disabled={loading}
            >
              Generate Collaboration Email
            </button>
          </div>
        ))}
      </div>

      {/* Email Preview Modal */}
      {emailPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-2">
              Email Preview
            </h2>

            <p className="text-sm mb-4 whitespace-pre-line">
              {emailPreview.content}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEmailPreview(null)}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEmail}
                className="btn-primary"
              >
                Save Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
