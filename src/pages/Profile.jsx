import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { getProfile, updateProfile } from "../api/users";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile(user);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-6 py-6 w-full max-w-9xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
                <img
                  src={user.avatar || "https://i.pravatar.cc/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {user.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                  {user.bio}
                </p>
              </div>

              {/* Edit Profile */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  Edit Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["name", "Name"],
                    ["email", "Email"],
                    ["location", "Location"],
                    ["role", "Role"],
                    ["website", "Website"],
                    ["twitter", "Twitter"],
                    ["linkedin", "LinkedIn"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={user[key] || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={user.bio || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
