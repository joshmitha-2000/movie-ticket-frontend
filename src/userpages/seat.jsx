import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const SeatSelection = () => {
  const navigate = useNavigate();
  const { showId } = useParams();
  const parsedShowId = parseInt(showId);

  const [seats, setSeats] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    if (storedUserId) setUserId(parseInt(storedUserId));
    else alert("User not logged in.");

    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (isNaN(parsedShowId)) {
      setError("Invalid show ID.");
      return;
    }

    const fetchSeats = async () => {
      try {
        const res = await axios.get(
          `https://ticketbooking-backend-sr3r.onrender.com/api/shows/${parsedShowId}/seats/available`
        );
        setSeats(res.data);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Could not fetch seat data.");
      }
    };

    fetchSeats();

    socketRef.current = io("https://ticketbooking-backend-sr3r.onrender.com");

    socketRef.current.emit("joinShow", parsedShowId);

    socketRef.current.on("seats", (updatedSeats) => {
      setSeats(updatedSeats);
      setSelectedSeats((prevSelected) =>
        prevSelected.filter((id) =>
          updatedSeats.find((seat) => seat.id === id && !seat.isBooked)
        )
      );
    });

    socketRef.current.on("error", (msg) => {
      setError(msg);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [parsedShowId]);

  const toggleSeat = (seatId) => {
    if (!seats) return;
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const getTotalPrice = () =>
    selectedSeats.reduce((sum, id) => {
      const seat = seats.find((s) => s.id === id);
      return sum + (seat?.price || 100);
    }, 0);

  const confirmBooking = async () => {
    if (!userId) return alert("User not logged in.");
    if (selectedSeats.length === 0) return alert("No seats selected.");

    setBookingLoading(true);
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const totalPrice = getTotalPrice();

      const res = await axios.post(
        "https://ticketbooking-backend-sr3r.onrender.com/api/booking/book",
        {
          userId,
          showId: parsedShowId,
          seatIds: selectedSeats,
          totalPrice,
        },
        config
      );

      if (socketRef.current) {
        selectedSeats.forEach((seatId) => {
          socketRef.current.emit("bookSeat", { showId: parsedShowId, seatId });
        });
      }

      alert("✅ Booking confirmed!");

      navigate("/payment", {
        state: {
          selectedSeats,
          totalPrice,
          showId: parsedShowId,
          bookingId: res.data.bookingId || null,
        },
      });

      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (seats === null) return <p className="text-center mt-10">Loading seats...</p>;
  if (seats.length === 0) return <p className="text-center mt-10">No seats available.</p>;

  // Split seats into two halves for vertical layout
  const half = Math.ceil(seats.length / 2);
  const firstHalfSeats = seats.slice(0, half);
  const secondHalfSeats = seats.slice(half);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">🎟️ Select Your Seats</h1>

      {/* First Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3 mb-8">
        {firstHalfSeats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.isBooked}
            onClick={() => toggleSeat(seat.id)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded font-bold text-xs sm:text-sm transition-all duration-200 ${
              seat.isBooked
                ? "bg-red-600 cursor-not-allowed"
                : selectedSeats.includes(seat.id)
                ? "bg-blue-600 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            title={`Seat ${seat.seatNumber} - ${seat.seatType}`}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      {/* Vertical gap between rows */}
      <div className="h-6 sm:h-10" />

      {/* Second Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3">
        {secondHalfSeats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.isBooked}
            onClick={() => toggleSeat(seat.id)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded font-bold text-xs sm:text-sm transition-all duration-200 ${
              seat.isBooked
                ? "bg-red-600 cursor-not-allowed"
                : selectedSeats.includes(seat.id)
                ? "bg-blue-600 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            title={`Seat ${seat.seatNumber} - ${seat.seatType}`}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-6 bg-green-100 text-black p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Selected Seats:</h2>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {selectedSeats.map((id) => {
              const seat = seats.find((s) => s.id === id);
              return (
                <li key={id} className="bg-green-300 px-2 py-1 rounded-full text-xs sm:text-sm">
                  {seat?.seatNumber} - ₹{seat?.price || 100}
                </li>
              );
            })}
          </ul>
          <p className="mt-2 font-semibold">Total Price: ₹{getTotalPrice()}</p>
        </div>
      )}

      <button
        onClick={confirmBooking}
        disabled={selectedSeats.length === 0 || bookingLoading}
        className={`mt-6 px-6 py-2 rounded text-white font-semibold ${
          bookingLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {bookingLoading ? "Booking..." : "✅ Confirm Booking"}
      </button>
    </div>
  );
};

export default SeatSelection;
