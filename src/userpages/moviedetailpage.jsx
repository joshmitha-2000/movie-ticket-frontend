import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://ticketbooking-backend-sr3r.onrender.com/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return <div className="text-white p-4 text-center">Loading...</div>;

  // Unique dates for shows formatted for display
  const availableDates = [
    ...new Set(
      movie.theatres.flatMap((theatre) =>
        theatre.shows.map((show) =>
          new Date(show.showTime).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        )
      )
    ),
  ];

  const availableLanguages = movie.languageTags || [];

  // Filter theatres and shows by selected date and language
  const filteredTheatres = movie.theatres.map((theatre) => {
    const filteredShows = theatre.shows.filter((show) => {
      const showDate = new Date(show.showTime).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const showLanguage = show.language || movie.languageTags[0];

      return (
        (!selectedDate || showDate === selectedDate) &&
        (!selectedLanguage || showLanguage === selectedLanguage)
      );
    });

    return { ...theatre, shows: filteredShows };
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 text-white">
      {/* Movie Poster & Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-xl object-cover max-h-[400px]"
        />
        <div className="flex flex-col justify-start space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold">{movie.title}</h1>
          <p className="text-sm sm:text-base">{movie.description}</p>
          <p className="text-sm sm:text-base">
            Duration: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
          </p>
          <p className="text-sm sm:text-base">Language: {movie.languageTags.join(", ")}</p>
          <p className="text-sm sm:text-base">Genre: {movie.category?.name || "N/A"}</p>
        </div>
      </div>

      {/* Date Selector */}
      <div>
        <h2 className="font-semibold mb-3 text-lg sm:text-xl">Select a Date</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 py-1">
          {availableDates.length > 0 ? (
            availableDates.map((date) => (
              <button
                key={date}
                className={`flex-shrink-0 px-4 py-2 border rounded-md transition-colors duration-200 ${
                  selectedDate === date
                    ? "bg-red-600 text-white border-red-600"
                    : "hover:bg-gray-700 border-gray-600"
                }`}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedShow(null);
                }}
              >
                {date}
              </button>
            ))
          ) : (
            <p>No dates available</p>
          )}
        </div>
      </div>

      {/* Language Selector */}
      <div>
        <h2 className="font-semibold mb-3 text-lg sm:text-xl">Select Language</h2>
        <div className="flex gap-2 flex-wrap">
          {availableLanguages.length > 0 ? (
            availableLanguages.map((lang) => (
              <button
                key={lang}
                className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                  selectedLanguage === lang
                    ? "bg-red-600 text-white border-red-600"
                    : "hover:bg-gray-700 border-gray-600"
                }`}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setSelectedShow(null);
                }}
              >
                {lang}
              </button>
            ))
          ) : (
            <p>No languages available</p>
          )}
        </div>
      </div>

      {/* Theatres and Timings */}
      <div>
        <h2 className="font-semibold mb-3 text-lg sm:text-xl">Available Theatres & Timings</h2>
        <div className="space-y-5">
          {filteredTheatres.some((t) => t.shows.length > 0) ? (
            filteredTheatres.map((theatre) => (
              <div key={theatre.id} className="border border-gray-700 p-4 rounded-xl">
                <h3 className="font-semibold text-lg sm:text-xl">
                  {theatre.name} - {theatre.location}
                </h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {theatre.shows.map((show) => {
                    const dateTime = new Date(show.showTime);
                    const time = dateTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const fullDate = dateTime.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const isSelected = selectedShow === show.id;

                    return (
                      <div key={show.id} className="flex flex-col items-center">
                        <button
                          className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                            show.availableSeats > 0
                              ? isSelected
                                ? "bg-red-600 text-white border-red-600"
                                : "hover:bg-gray-700 border-gray-600"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          disabled={show.availableSeats === 0}
                          onClick={() => setSelectedShow(show.id)}
                        >
                          {time}
                        </button>
                        <span className="text-xs text-gray-400 mt-1">{fullDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No theatres available for selected date and language.</p>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end">
        <button
          className={`mt-4 px-6 py-3 rounded-md font-semibold transition-colors duration-200 ${
            selectedDate && selectedLanguage && selectedShow
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!(selectedDate && selectedLanguage && selectedShow)}
          onClick={() => navigate(`/book/${selectedShow}`)}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
