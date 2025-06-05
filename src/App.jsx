import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/navbar";
import AuthForm from "./pages/authform";
import UserHome from "./dashboard/user";
import AdminDashboard from "./dashboard/admin";
import ProtectedRoute from "./pages/protucted"; 
import { AppSidebar } from "./adminpages/sidebar";
import { Header } from "./adminpages/header";
import MovieManager from "./adminpages/movie";
import TheatresList from "./adminpages/theatre";
import ShowsList from "./adminpages/shows";
import MovieDetailPage from "./userpages/moviedetailpage";
import SeatSelection from "./userpages/seat";
import AdminBookingPage from "./adminpages/bookingpage";
import PaymentPage from "./userpages/payment";
import UserBookings from "./userpages/bookings";

export default function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/"];
  const isAdminDashboard = location.pathname.startsWith("/admin");

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  return (
    <>
      {/* Show Navbar only on non-login and non-admin pages */}
      {!hideNavbarPaths.includes(location.pathname) && !isAdminDashboard && (
        <Navbar />
      )}

      {/* Admin Dashboard Layout */}
      {isAdminDashboard ? (
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-auto p-4">
              <Routes>
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/movies"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <MovieManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/theatres"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <TheatresList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/shows"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <ShowsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminBookingPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        // User & Other pages layout
        <div
          className={
            !hideNavbarPaths.includes(location.pathname) ? "pt-20" : ""
          }
        >
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route
              path="/user/home"
              element={
                <ProtectedRoute role="USER">
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/movie/:id"
              element={
                <ProtectedRoute role="USER">
                  <MovieDetailPage />
                </ProtectedRoute>
              }
            />
          <Route
  path="book/:showId"
  element={
    <ProtectedRoute role="USER">
      <SeatSelection userId={userId} />
    </ProtectedRoute>
  }
/>
<Route path="/payment" element={ <ProtectedRoute role="USER">
      <PaymentPage role="USER"/>
    </ProtectedRoute>} />
    <Route
    path="/user/bookings"
    element={
      <ProtectedRoute role="USER">
        <UserBookings />
      </ProtectedRoute>
    }
  />

          </Routes>
        </div>
      )}
      
    </>
  );
}
