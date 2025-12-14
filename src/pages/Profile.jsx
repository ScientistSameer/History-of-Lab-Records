import React, { useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Researcher",
    bio: "Passionate about AI and data science.",
    location: "New York, USA",
    website: "https://johndoe.com",
    twitter: "https://twitter.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Here you can integrate API call to save user profile
    alert("Profile saved successfully!");
  };

  return (
    <div className="px-6 py-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/150?img=3"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {user.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">{user.role}</p>
          <p className="text-gray-600 dark:text-gray-300 text-center">{user.bio}</p>
        </div>

        {/* Editable Profile Fields */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Edit Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={user.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                name="bio"
                value={user.bio}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={user.website}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={user.twitter}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={user.linkedin}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
