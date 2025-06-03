import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://ticketbooking-backend-sr3r.onrender.com/api/booking/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          console.warn("Unexpected response:", response.data);
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-white text-center py-10">Loading bookings...</div>;
  if (error) return <div className="text-white text-center py-10">{error}</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-white max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-300 text-lg sm:text-xl">No bookings found.</p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="p-4 sm:p-6 border border-gray-700 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <p className="text-base sm:text-lg mb-1"><strong>Movie:</strong> {booking.show.movie.title}</p>
              <p className="text-sm sm:text-base mb-1">
                <strong>Show Time:</strong> {booking.show.startTime || booking.show.time}
              </p>
              <p className="text-sm sm:text-base mb-1">
                <strong>Seats:</strong> {booking.seats.map((seat) => seat.seatNumber).join(", ")}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Status:</strong> {booking.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
