import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";

export default function UserDashboard() {
  const [movies, setMovies] = useState([]);
  const [showsByMovie, setShowsByMovie] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesAndShows = async () => {
      try {
        const res = await axios.get("https://ticketbooking-backend-sr3r.onrender.com/api/movies");
        setMovies(res.data);

        const showsRequests = res.data.map((movie) =>
          axios.get(`https://ticketbooking-backend-sr3r.onrender.com/api/movies/${movie.id}/shows`)
        );

        const showsResponses = await Promise.all(showsRequests);

        const showsMap = {};
        showsResponses.forEach((response, idx) => {
          showsMap[res.data[idx].id] = response.data;
        });

        setShowsByMovie(showsMap);
      } catch (error) {
        console.error("Error fetching movies or shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesAndShows();
  }, []);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading movies...</div>;
  }

  return (
    <div className="space-y-10 min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 py-6">
      {/* Auto-scrolling top banner */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover rounded-sm shadow-lg"
            />
            <h3 className="text-center mt-2 font-semibold text-red-500 text-lg sm:text-xl">
              {movie.title}
            </h3>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Grid of All Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
          >
            <Link
              to={`/user/movie/${movie.id}`}
              className="group block rounded-t-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-72 sm:h-80 md:h-72 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h2 className="font-bold text-lg sm:text-xl text-white truncate group-hover:text-red-500 transition-colors duration-300">
                  {movie.title}
                </h2>
              </div>
            </Link>

            {/* Shows info */}
            <div className="px-4 pb-2 text-sm text-gray-300 flex-grow">
              <h4 className="font-semibold mb-1">Available Shows:</h4>
              {showsByMovie[movie.id] && showsByMovie[movie.id].length > 0 ? (
                <ul className="max-h-24 overflow-y-auto">
                  {showsByMovie[movie.id].map((show) => (
                    <li key={show.id} className="mb-1">
                      <strong>Theatre:</strong> {show.theatre.name} <br />
                      <strong>Showtime:</strong>{" "}
                      {new Date(show.showTime).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No shows available.</p>
              )}
            </div>

            <div className="px-4 pb-4">
              <button className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition">
                Book Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Banner with Slogan */}
      <div className="relative mt-10">
        <img
          src="https://media.istockphoto.com/id/1292150773/vector/realistic-3d-film-strips-in-perspective-modern-cinema-background-template-poster-for-cinema.jpg?s=612x612&w=0&k=20&c=dU-NREO0miQ20cFSQkps2Aqixoo29b0sL54lBKb8cxU="
          alt="Cinema Banner"
          className="w-full h-24 sm:h-32 md:h-40 rounded-lg object-cover"
        />
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 text-amber-500 text-xl sm:text-3xl md:text-4xl font-bold italic tracking-wide drop-shadow-md max-w-xs sm:max-w-md">
          Endless Entertainment Anytime, Anywhere
        </div>
      </div>
    </div>
  );
}
