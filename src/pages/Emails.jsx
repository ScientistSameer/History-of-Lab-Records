import { useEffect, useState } from "react";
import { getEmails } from "../api/emails";

export default function Emails() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    getEmails().then(setEmails);
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Email History
      </h1>

      {/* Emails Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left">To</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {emails.map((email) => (
              <tr
                key={email.id}
                className="border-t dark:border-gray-700"
              >
                <td className="px-4 py-3 font-medium">
                  {email.subject}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {email.from_lab}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {email.to_lab}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(email.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedEmail(email)}
                    className="text-indigo-600 hover:underline"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}

            {emails.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No emails found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-2">
              {selectedEmail.subject}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              From: {selectedEmail.from_lab} → To: {selectedEmail.to_lab}
            </p>

            <p className="whitespace-pre-line text-gray-800 dark:text-gray-100 mb-4">
              {selectedEmail.content}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
