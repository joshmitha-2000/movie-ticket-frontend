import React, { useEffect, useState } from "react";

function ShowsList() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    id: null,
    movieId: "",
    theatreId: "",
    showTime: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Seat creation states
  const [seatCount, setSeatCount] = useState("");
  const [seatCreatingShowId, setSeatCreatingShowId] = useState(null);
  const [seatCreationLoading, setSeatCreationLoading] = useState(false);
  const [seatCreationError, setSeatCreationError] = useState(null);
  const [seatCreationSuccess, setSeatCreationSuccess] = useState(null);

  // Helper to get token and create headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const fetchShows = () => {
    setLoading(true);
    fetch("https://ticketbooking-backend-sr3r.onrender.com/api/shows", {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch shows");
        return res.json();
      })
      .then((data) => {
        setShows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function toISOStringLocal(datetimeLocal) {
    const date = new Date(datetimeLocal);
    return date.toISOString();
  }

  const handleAdd = (e) => {
    e.preventDefault();
    setError(null);
    fetch("https://ticketbooking-backend-sr3r.onrender.com/api/shows", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        movieId: Number(form.movieId),
        theatreId: Number(form.theatreId),
        showTime: toISOStringLocal(form.showTime),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add show");
        return res.json();
      })
      .then(() => {
        setForm({ id: null, movieId: "", theatreId: "", showTime: "" });
        fetchShows();
      })
      .catch((err) => setError(err.message));
  };

  const startEdit = (show) => {
    setForm({
      id: show.id,
      movieId: show.movieId,
      theatreId: show.theatreId,
      showTime: new Date(show.showTime).toISOString().slice(0, 16),
    });
    setIsEditing(true);
    setError(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setError(null);
    fetch(`https://ticketbooking-backend-sr3r.onrender.com/api/shows/${form.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        movieId: Number(form.movieId),
        theatreId: Number(form.theatreId),
        showTime: toISOStringLocal(form.showTime),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update show");
        return res.json();
      })
      .then(() => {
        setForm({ id: null, movieId: "", theatreId: "", showTime: "" });
        setIsEditing(false);
        fetchShows();
      })
      .catch((err) => setError(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    setError(null);
    fetch(`https://ticketbooking-backend-sr3r.onrender.com/api/shows/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete show");
        fetchShows();
      })
      .catch((err) => setError(err.message));
  };

  // --- New: Create seats handler ---
  const handleCreateSeats = async (showId) => {
    if (!seatCount || seatCount <= 0) {
      setSeatCreationError("Please enter a valid number of seats");
      return;
    }

    setSeatCreationLoading(true);
    setSeatCreationError(null);
    setSeatCreationSuccess(null);

    try {
      const res = await fetch(`https://ticketbooking-backend-sr3r.onrender.com/api/seat/${showId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          seatCount: Number(seatCount),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create seats");
      }

      setSeatCreationSuccess("Seats created successfully!");
      setSeatCount("");
      setSeatCreatingShowId(null);
      fetchShows(); // Refresh shows if seat info affects UI
    } catch (err) {
      setSeatCreationError(err.message);
    } finally {
      setSeatCreationLoading(false);
    }
  };

  if (loading) return <p className="text-white p-4">Loading shows...</p>;
  if (error)
    return (
      <p className="text-red-500 bg-gray-900 p-4 rounded-md font-semibold">
        Error: {error}
      </p>
    );

    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {isEditing ? "Edit Show" : "Add New Show"}
        </h2>
        <form
          onSubmit={isEditing ? handleUpdate : handleAdd}
          className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
        >
          <input
            type="number"
            name="movieId"
            placeholder="Movie ID"
            value={form.movieId}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="number"
            name="theatreId"
            placeholder="Theatre ID"
            value={form.theatreId}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="datetime-local"
            name="showTime"
            value={form.showTime}
            onChange={handleChange}
            required
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition"
            >
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({ id: null, movieId: "", theatreId: "", showTime: "" });
                  setError(null);
                }}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-semibold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
    
        <h2 className="text-2xl font-bold text-red-500 mb-4">Available Shows</h2>
        <ul className="space-y-6">
          {shows.map((show) => (
            <li
              key={show.id}
              className="bg-gray-800 p-4 rounded-md shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row sm:space-x-6 flex-1 min-w-0">
                <div className="truncate">
                  <strong>Movie:</strong>{" "}
                  <span className="text-ellipsis overflow-hidden block whitespace-nowrap">
                    {show.movie.title}
                  </span>
                </div>
                <div className="truncate">
                  <strong>Theatre:</strong>{" "}
                  <span className="text-ellipsis overflow-hidden block whitespace-nowrap">
                    {show.theatre.name}
                  </span>
                </div>
                <div className="truncate">
                  <strong>Show Time:</strong>{" "}
                  <span>{new Date(show.showTime).toLocaleString()}</span>
                </div>
              </div>
    
              {/* Buttons */}
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => startEdit(show)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md font-semibold transition flex-1 sm:flex-auto text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(show.id)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md font-semibold transition flex-1 sm:flex-auto text-center"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    seatCreatingShowId === show.id
                      ? setSeatCreatingShowId(null)
                      : setSeatCreatingShowId(show.id)
                  }
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md font-semibold transition flex-1 sm:flex-auto text-center"
                >
                  {seatCreatingShowId === show.id
                    ? "Cancel Seat Creation"
                    : "Create Seats"}
                </button>
              </div>
    
              {/* Seat creation form for this show */}
              {seatCreatingShowId === show.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateSeats(show.id);
                  }}
                  className="mt-4 sm:mt-2 flex flex-col sm:flex-row gap-2 sm:items-center sm:space-x-4 w-full sm:max-w-md"
                >
                  <label
                    className="font-semibold whitespace-nowrap"
                    htmlFor={`seatCount-${show.id}`}
                  >
                    Number of Seats:
                  </label>
                  <input
                    id={`seatCount-${show.id}`}
                    type="number"
                    min="1"
                    value={seatCount}
                    onChange={(e) => setSeatCount(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={seatCreationLoading}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-semibold transition flex-none"
                  >
                    {seatCreationLoading ? "Creating..." : "Create Seats"}
                  </button>
                  {seatCreationError && (
                    <p className="text-red-500 mt-1 sm:mt-0 whitespace-normal sm:whitespace-nowrap">
                      {seatCreationError}
                    </p>
                  )}
                  {seatCreationSuccess && (
                    <p className="text-green-500 mt-1 sm:mt-0 whitespace-normal sm:whitespace-nowrap">
                      {seatCreationSuccess}
                    </p>
                  )}
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }    

export default ShowsList;
