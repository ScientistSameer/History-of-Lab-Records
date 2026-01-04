import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import logo from "../images/logo.jfif";

// Optional: you can hook this to your backend API later
// import { updateProfile } from "../api/users";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "IDEAL Labs",
    avatar: logo,
    role: "Research Laboratory",
    email: "ideal.labs@example.com",
    location: "Lahore, Pakistan",
    website: "https://ideallabs.example.com",
    twitter: "@ideallabs",
    linkedin: "https://www.linkedin.com/company/ideallabs",
    bio: "IDEAL Labs is a premier research laboratory focused on Artificial Intelligence, Machine Learning, and interdisciplinary innovation. We collaborate with other labs to advance cutting-edge research and technological development.",
    domain: "Artificial Intelligence",
    total_researchers: 15,
    ongoing_projects: ["AI in Healthcare", "Smart Automation", "Robotics Integration"],
    contact_number: "+92 300 1234567"
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Optional: call backend to save data
      // await updateProfile(profile);

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            IDEAL Labs Profile
          </h1>

          {!editing ? (
            // ---------------- View Mode ----------------
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex flex-col items-center">
                  <img
                    src={profile.avatar}
                    alt="IDEAL Labs"
                    className="w-32 h-32 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{profile.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-center mt-2">{profile.bio}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <p><strong>Domain:</strong> {profile.domain}</p>
                  <p><strong>Researchers:</strong> {profile.total_researchers}</p>
                  <p><strong>Ongoing Projects:</strong> {profile.ongoing_projects.join(", ")}</p>
                  <p><strong>Contact:</strong> {profile.contact_number}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Website:</strong> <a className="text-indigo-600" href={profile.website} target="_blank">{profile.website}</a></p>
                  <p><strong>Twitter:</strong> {profile.twitter}</p>
                  <p><strong>LinkedIn:</strong> <a className="text-indigo-600" href={profile.linkedin} target="_blank">{profile.linkedin}</a></p>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            // ---------------- Edit Mode ----------------
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["name", "Name"],
                  ["role", "Role"],
                  ["email", "Email"],
                  ["location", "Location"],
                  ["website", "Website"],
                  ["twitter", "Twitter"],
                  ["linkedin", "LinkedIn"],
                  ["domain", "Domain"],
                  ["contact_number", "Contact Number"]
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input
                      type="text"
                      name={key}
                      value={profile[key]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Ongoing Projects</label>
                  <textarea
                    name="ongoing_projects"
                    rows={3}
                    value={profile.ongoing_projects.join(", ")}
                    onChange={(e) =>
                      setProfile({ ...profile, ongoing_projects: e.target.value.split(",") })
                    }
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
