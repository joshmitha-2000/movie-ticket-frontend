import React, { useState, useEffect } from "react";

const API_BASE = "https://ticketbooking-backend-sr3r.onrender.com/api/theatres";

export default function TheatreDashboard() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    location: "",
    seatCapacity: "",
  });

  const token = localStorage.getItem("token") || "";
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  async function fetchTheatres() {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, { headers });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setTheatres(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load theatres");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTheatres();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const theatreData = {
      name: form.name,
      location: form.location,
      seatCapacity: Number(form.seatCapacity),
    };

    try {
      let res;
      if (form.id) {
        res = await fetch(`${API_BASE}/${form.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(theatreData),
        });
      } else {
        res = await fetch(API_BASE, {
          method: "POST",
          headers,
          body: JSON.stringify(theatreData),
        });
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      await fetchTheatres();
      setForm({
        id: null,
        name: "",
        location: "",
        seatCapacity: "",
      });
    } catch (err) {
      alert(err.message || "Failed to save theatre");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure to delete this theatre?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      await fetchTheatres();
    } catch (err) {
      alert(err.message || "Failed to delete theatre");
    }
  }

  function handleEdit(theatre) {
    setForm({
      id: theatre.id,
      name: theatre.name || "",
      location: theatre.location || "",
      seatCapacity: theatre.seatCapacity ? theatre.seatCapacity.toString() : "",
    });
  }

  return (
    <div className="p-4 max-w-5xl mx-auto bg-gray-900 rounded-lg text-white">
      <h2 className="text-3xl font-bold mb-6 text-red-500">Theatre Dashboard</h2>

      {/* Theatre Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-800 p-6 rounded-md shadow-lg space-y-5"
      >
        <h3 className="text-xl font-semibold text-yellow-400">
          {form.id ? "Edit Theatre" : "Add Theatre"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Theatre Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            name="seatCapacity"
            placeholder="Seat Capacity"
            value={form.seatCapacity}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition w-full sm:w-auto"
          >
            {form.id ? "Update" : "Add"} Theatre
          </button>

          {form.id && (
            <button
              type="button"
              onClick={() =>
                setForm({ id: null, name: "", location: "", seatCapacity: "" })
              }
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition w-full sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Theatre List Table */}
      <h3 className="text-2xl font-semibold mb-4">Theatres List</h3>

      {loading && <p>Loading theatres...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-gray-700">
        <table className="min-w-full table-auto border-collapse bg-gray-800 text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left border-r border-gray-600">ID</th>
              <th className="py-3 px-4 text-left border-r border-gray-600">Name</th>
              <th className="py-3 px-4 text-left border-r border-gray-600">Location</th>
              <th className="py-3 px-4 text-left border-r border-gray-600">Seat Capacity</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No theatres found.
                </td>
              </tr>
            )}

            {theatres.map((theatre) => (
              <tr
                key={theatre.id}
                className="even:bg-gray-700 odd:bg-gray-800"
              >
                <td className="py-2 px-4 border-r border-gray-600">{theatre.id}</td>
                <td className="py-2 px-4 border-r border-gray-600">{theatre.name}</td>
                <td className="py-2 px-4 border-r border-gray-600">{theatre.location}</td>
                <td className="py-2 px-4 border-r border-gray-600">{theatre.seatCapacity}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(theatre)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(theatre.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
