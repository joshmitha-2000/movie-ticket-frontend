import React, { useEffect, useState } from 'react';

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    'https://ticketbooking-backend-sr3r.onrender.com/api/booking/all-bookings';
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchBookings() {
      if (!token) {
        setError('No authorization token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await res.json();
        console.log('Fetched Bookings:', data); 
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token]);

  if (loading)
    return (
      <div className="text-red-600 text-center py-4">Loading bookings...</div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center py-4">Error: {error}</div>
    );

  return (
    <div className="p-5 text-white max-w-full">
      <h1 className="text-2xl font-bold mb-5 text-red-600 text-center">
        Admin Booking Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse border border-white text-sm md:text-base"
          aria-label="Admin Booking Table"
        >
          <thead>
            <tr>
              {[
                'Booking ID',
                'User',
                'Email',
                'Movie Title',
                'Total Price',
                'Status',
                'Created At',
              ].map((heading) => (
                <th
                  key={heading}
                  className="border border-white px-2 py-1 md:px-4 md:py-2 text-left bg-gray-900"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center border border-white py-4 text-gray-400"
                >
                  No bookings found
                </td>
              </tr>
            )}

            {bookings.map((booking) => (
              <tr
                key={booking.bookingId}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.bookingId}
                </td>
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.userName || 'N/A'}
                </td>
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.userEmail || 'N/A'}
                </td>
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.movieTitle || 'N/A'}
                </td>
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.totalPrice != null
                    ? `₹${booking.totalPrice.toFixed(2)}`
                    : 'N/A'}
                </td>
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.status || 'N/A'}
                </td>
                <td className="border border-white px-2 py-1 md:px-4 md:py-2">
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
