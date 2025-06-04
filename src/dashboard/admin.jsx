import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalMovies: 0,
    totalBookingsToday: 0,
    totalRevenueToday: 0,
    totalSeatsBookedToday: 0,
    totalSeatsAvailableToday: 0,
    todayShowsList: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await axios.get("https://ticketbooking-backend-sr3r.onrender.com/api/admin/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching admin dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-lg font-medium">Loading dashboard...</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 text-center sm:text-left">
        🎬 Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
        <DashboardCard title="Total Movies" value={dashboardData.totalMovies} />
        <DashboardCard title="Today's Bookings" value={dashboardData.totalBookingsToday} />
        <DashboardCard title="Revenue Today" value={`₹ ${dashboardData.totalRevenueToday}`} />
        <DashboardCard
          title="Seats Booked / Available"
          value={`${dashboardData.totalSeatsBookedToday} / ${dashboardData.totalSeatsAvailableToday}`}
        />
      </div>

      {/* Today's Shows */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-4">🎥 Today’s Shows</h2>
        {dashboardData.todayShowsList.length === 0 ? (
          <p className="text-gray-600">No shows scheduled for today.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Movie</th>
                <th className="py-2">Theatre</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.todayShowsList.map((show, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2">{show.movieTitle}</td>
                  <td className="py-2">{show.theatreName}</td>
                  <td className="py-2">{new Date(show.showTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md p-5 rounded-lg hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-base sm:text-lg font-semibold mb-2">{title}</h2>
      <p className="text-2xl sm:text-3xl font-medium">{value}</p>
    </div>
  );
};
