import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalMovies: 0,
    totalBookingsToday: 0,
    totalRevenueToday: 0,
    totalSeatsBookedToday: 0,
    totalSeatsAvailableToday: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await axios.get("https://ticketbooking-backend-sr3r.onrender.com/api/admin/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching admin dashboard data", error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 text-center sm:text-left">
        🎬 Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            title: "Total Movies",
            value: dashboardData.totalMovies,
          },
          {
            title: "Today's Bookings",
            value: dashboardData.totalBookingsToday,
          },
          {
            title: "Revenue Today",
            value: `₹ ${dashboardData.totalRevenueToday}`,
          },
          {
            title: "Seats Booked / Available",
            value: `${dashboardData.totalSeatsBookedToday} / ${dashboardData.totalSeatsAvailableToday}`,
          },
        ].map(({ title, value }, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-5 rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-base sm:text-lg font-semibold mb-2">{title}</h2>
            <p className="text-2xl sm:text-3xl font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
