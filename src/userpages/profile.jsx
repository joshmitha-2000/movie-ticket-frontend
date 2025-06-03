import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileToast({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("https://ticketbooking-backend-sr3r.onrender.com/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
          setForm({ name: response.data.user.name, email: response.data.user.email });
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("https://ticketbooking-backend-sr3r.onrender.com/api/user/profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      setEdit(false);
      alert("Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 w-80 max-w-full sm:w-96 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50
                    sm:top-20 sm:right-6
                    md:right-8
                    lg:right-12
                    xl:right-16
                    ">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg sm:text-xl font-bold">Your Profile</h3>
        <button onClick={onClose} className="text-sm text-red-400 hover:text-red-600 transition-colors">✖</button>
      </div>

      {user ? (
        <>
          {edit ? (
            <>
              <div className="mb-3">
                <label className="block text-sm sm:text-base mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm sm:text-base mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-green-600 rounded text-sm sm:text-base hover:bg-green-700 transition-colors"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-sm sm:text-base hover:bg-gray-600 transition-colors"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm sm:text-base"><strong>Name:</strong> {user.name}</p>
              <p className="text-sm sm:text-base"><strong>Email:</strong> {user.email}</p>
              <button
                className="mt-4 text-blue-400 underline text-sm sm:text-base hover:text-blue-600 transition-colors"
                onClick={() => setEdit(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </>
      ) : (
        <p className="text-center text-sm sm:text-base">Loading...</p>
      )}
    </div>
  );
}
