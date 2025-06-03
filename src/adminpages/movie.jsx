import React, { useState, useEffect } from "react";

const API_BASE = "https://ticketbooking-backend-sr3r.onrender.com/api/movies";

export default function MovieDashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    posterUrl: "",
    runtime: "",
    categoryId: "",
    price: "",
    languageTags: "",
    availableDates: "",
  });

  const token = localStorage.getItem("token") || "";
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  async function fetchMovies() {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, { headers });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setMovies(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const movieData = {
      title: form.title,
      description: form.description,
      posterUrl: form.posterUrl,
      runtime: Number(form.runtime),
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      languageTags: form.languageTags
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      availableDates: form.availableDates
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
    };

    try {
      let res;
      if (form.id) {
        res = await fetch(`${API_BASE}/${form.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(movieData),
        });
      } else {
        res = await fetch(API_BASE, {
          method: "POST",
          headers,
          body: JSON.stringify(movieData),
        });
      }
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      await fetchMovies();
      resetForm();
    } catch (err) {
      alert(err.message || "Failed to save movie");
    }
  }

  function resetForm() {
    setForm({
      id: null,
      title: "",
      description: "",
      posterUrl: "",
      runtime: "",
      categoryId: "",
      price: "",
      languageTags: "",
      availableDates: "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure to delete this movie?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Failed to delete movie: ${res.status}`);

      await fetchMovies();
    } catch (err) {
      alert(err.message || "Failed to delete movie");
    }
  }

  function handleEdit(movie) {
    setForm({
      id: movie.id,
      title: movie.title || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      runtime: movie.runtime ? movie.runtime.toString() : "",
      categoryId: movie.category?.id ? movie.category.id.toString() : "",
      price: movie.price ? movie.price.toString() : "",
      languageTags: movie.languageTags ? movie.languageTags.join(", ") : "",
      availableDates: movie.availableDates
        ? movie.availableDates
            .map((date) => date.slice(0, 10)) // YYYY-MM-DD
            .join(", ")
        : "",
    });
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-gray-900 rounded-lg text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-red-500 text-center sm:text-left">
        Admin Movie Dashboard
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-gray-800 p-4 sm:p-6 rounded-md shadow-lg space-y-5"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-yellow-400">
          {form.id ? "Edit Movie" : "Add Movie"}
        </h3>

        {/* Responsive grid form inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="url"
            name="posterUrl"
            placeholder="Poster URL"
            value={form.posterUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="number"
            name="runtime"
            placeholder="Runtime (minutes)"
            value={form.runtime}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="number"
            name="categoryId"
            placeholder="Category ID"
            value={form.categoryId}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="text"
            name="languageTags"
            placeholder="Languages (comma separated)"
            value={form.languageTags}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />

          <input
            type="text"
            name="availableDates"
            placeholder="Dates (YYYY-MM-DD, comma separated)"
            value={form.availableDates}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 col-span-1 sm:col-span-2"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />

        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 justify-end">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded font-semibold transition"
          >
            {form.id ? "Update Movie" : "Add Movie"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold transition"
          >
            Clear
          </button>
        </div>
      </form>

      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-yellow-400">
        Movies List
      </h3>

      {loading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse border border-gray-700 text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">ID</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Title</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Runtime</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Category</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Price</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Languages</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Dates</th>
                <th className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="odd:bg-gray-700 even:bg-gray-600">
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">{movie.id}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">{movie.title}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">{movie.runtime}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">{movie.category?.name || "N/A"}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">${movie.price?.toFixed(2)}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">{movie.languageTags?.join(", ")}</td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm">
                    {movie.availableDates?.map((d) => d.slice(0, 10)).join(", ")}
                  </td>
                  <td className="border border-gray-600 px-2 py-1 text-xs sm:text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
