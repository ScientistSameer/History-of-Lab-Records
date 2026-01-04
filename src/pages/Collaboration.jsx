// src/pages/Collaboration.jsx

import { useEffect, useState, useRef } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Info from "../components/Info"; // ✅ Import Info component
import CollaborationScoreInfo from "../components/CollaborationScoreInfo"; // ✅ Import content
import { getSuggestions, sendEmail } from "../api/collaboration";
import { startCollaborationAI } from "../api/collaboration_ai";

export default function Collaboration() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState("rule");

  // Rule-based
  const [suggestions, setSuggestions] = useState([]);

  // AI-based
  const [aiTask, setAiTask] = useState("Find collaboration opportunities for IDEAL Lab");
  const [aiResults, setAiResults] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const wsRef = useRef(null);

  // Email Draft Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailDraft, setEmailDraft] = useState({
    to_lab_id: null,
    to_lab_name: "",
    to_email: "",
    subject: "",
    body: ""
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (mode === "rule") fetchSuggestions();
  }, [mode]);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await getSuggestions();
      setSuggestions(res);
    } catch (err) {
      console.error(err);
    }
  };

  const runAI = () => {
    setLoadingAI(true);
    setAiResults([]);

    wsRef.current = startCollaborationAI(aiTask, (msg) => {
      if (msg.type === "status") {
        console.log(msg.message);
      } else if (msg.type === "result") {
        setLoadingAI(false);

        if (msg.data?.recommendations && Array.isArray(msg.data.recommendations)) {
          setAiResults(msg.data.recommendations);
        } else if (msg.data?.error) {
          alert(msg.data.error);
        } else {
          alert("Unexpected AI response format.");
        }
      } else if (msg.type === "error") {
        setLoadingAI(false);
        alert(msg.message);
      }
    });
  };

  const openEmailDraft = (lab) => {
    const subject = `Collaboration Proposal from IDEAL Labs`;
    const body = `Hello ${lab.to_lab || lab.lab_name} Team,

We at IDEAL Labs noticed that our labs share expertise in ${lab.shared_domain || lab.domain}.

${lab.reason ? `\n${lab.reason}\n` : ""}

${lab.recommended_projects && lab.recommended_projects.length > 0 ? 
  `We believe we could collaborate on:\n${lab.recommended_projects.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n` 
  : ""}

We would love to explore potential collaboration opportunities with your team.

Please let us know if you are interested in discussing this further.

Best regards,
IDEAL Labs Team`;

    setEmailDraft({
      to_lab_id: lab.to_lab_id || lab.lab_id,
      to_lab_name: lab.to_lab || lab.lab_name,
      to_email: lab.lab_email || "",
      subject,
      body
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!emailDraft.to_lab_id) {
      alert("Invalid lab ID");
      return;
    }

    setSendingEmail(true);
    try {
      await sendEmail({ 
        to_lab_id: emailDraft.to_lab_id,
        subject: emailDraft.subject,
        body: emailDraft.body
      });
      alert("Email sent successfully!");
      setShowEmailModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow p-6">
          {/* ✅ NEW: Header with Info Box */}
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold">Collaboration Opportunities</h1>
            
            {/* ✅ Info Box - Only show in AI mode */}
            {mode === "ai" && (
              <Info position="bottom" containerClassName="!w-auto">
                <CollaborationScoreInfo />
              </Info>
            )}
          </div>

          {/* MODE SWITCH */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("rule")}
              className={`px-4 py-2 rounded ${mode === "rule" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              Rule-Based
            </button>

            <button
              onClick={() => setMode("ai")}
              className={`px-4 py-2 rounded ${mode === "ai" ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              Agentic AI
            </button>
          </div>

          {/* RULE-BASED VIEW */}
          {mode === "rule" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((s) => (
                <div key={s.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="font-semibold">{s.from_lab} ↔ {s.to_lab}</h3>

                  <p className="text-sm text-gray-500 mb-1">
                    Similar domain: <strong>{s.shared_domain}</strong>
                  </p>

                  <p className="text-xs text-gray-400 mb-2">
                    Potential collaboration in: {s.shared_fields.join(", ")}
                  </p>

                  <button
                    onClick={() => openEmailDraft(s)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                  >
                    Send Collaboration Email
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* AGENTIC AI VIEW */}
          {mode === "ai" && (
            <>
              <textarea
                className="border p-2 w-full mb-4 rounded dark:bg-gray-800 dark:border-gray-600"
                value={aiTask}
                onChange={(e) => setAiTask(e.target.value)}
                rows={3}
                placeholder="Describe what you're looking for in a collaboration..."
              />

              <button
                onClick={runAI}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 mb-4 rounded disabled:opacity-50"
                disabled={loadingAI}
              >
                {loadingAI ? "Analyzing..." : "Run Agentic AI"}
              </button>

              {loadingAI && (
                <div className="mb-4 text-gray-500 flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing collaboration opportunities...</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResults.length > 0 ? (
                  aiResults.map((r, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{r.lab_name}</h3>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          r.grade === "Excellent" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                          r.grade === "Good" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                          r.grade === "Fair" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {r.grade}
                        </span>
                      </div>

                      <p className="text-sm mb-1">
                        <strong>Domain:</strong> {r.domain}
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <strong className="text-sm">Match Score:</strong>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              r.score >= 80 ? "bg-green-500" :
                              r.score >= 60 ? "bg-blue-500" :
                              r.score >= 40 ? "bg-yellow-500" :
                              "bg-gray-500"
                            }`}
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{r.score}/100</span>
                      </div>

                      {/* Score Breakdown */}
                      {r.score_breakdown && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          <strong className="block mb-1">Why this score:</strong>
                          <ul className="space-y-0.5">
                            {Object.entries(r.score_breakdown).map(([key, value]) => (
                              <li key={key}>• {value}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{r.reason}</p>

                      {r.recommended_projects && r.recommended_projects.length > 0 && (
                        <div className="text-xs text-gray-400 mb-3">
                          <strong>Recommended Projects:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-0.5">
                            {r.recommended_projects.map((proj, idx) => (
                              <li key={idx}>{proj}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={() => openEmailDraft(r)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full transition"
                      >
                        Send Collaboration Email
                      </button>
                    </div>
                  ))
                ) : (
                  !loadingAI && (
                    <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-12">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-lg">No AI suggestions yet.</p>
                      <p className="text-sm mt-1">Click "Run Agentic AI" to find collaboration opportunities.</p>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* EMAIL DRAFT MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Review & Send Email</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To:</label>
                <input
                  type="text"
                  value={emailDraft.to_lab_name}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <input
                  type="email"
                  value={emailDraft.to_email}
                  disabled
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject:</label>
                <input
                  type="text"
                  value={emailDraft.subject}
                  onChange={(e) => setEmailDraft({...emailDraft, subject: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message:</label>
                <textarea
                  rows={12}
                  value={emailDraft.body}
                  onChange={(e) => setEmailDraft({...emailDraft, body: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50 transition"
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>

              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}