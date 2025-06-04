import React, { useState } from "react";
import { FaHome, FaTicketAlt, FaUser, FaFilm } from "react-icons/fa"; 
import { Link } from "react-router-dom";
import ProfileToast from "../userpages/profile";

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#cc0707] text-white px-4 py-2 z-50 flex items-center justify-between fixed top-0 left-0 right-0 shadow-md w-full">
        <div className="text-3xl font-extrabold tracking-wide bg-gradient-to-r text-white bg-clip-text drop-shadow-md italic">
          🎬 Bookit
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-lg items-center">
          <li className="hover:underline cursor-pointer flex items-center gap-1">
            <FaHome />
            <Link to="/user/home">Home</Link>
          </li>
          <li className="hover:underline cursor-pointer flex items-center gap-1">
            <FaTicketAlt />
            <Link to="/user/bookings">Bookings</Link>
          </li>
          <li
            className="hover:underline cursor-pointer flex items-center gap-1"
            onClick={() => setShowProfile(true)}
          >
            <FaUser />
            <span>Profile</span>
          </li>
        </ul>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-3xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#cc0707] text-white fixed top-[56px] left-0 right-0 shadow-lg z-40 flex flex-col py-4 px-6 space-y-4">
          <Link
            to="/user/home"
            className="hover:underline flex items-center gap-2 text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaHome /> Home
          </Link>

          <Link
            to="/user/bookings"
            className="hover:underline flex items-center gap-2 text-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTicketAlt /> Bookings
          </Link>
          <button
            onClick={() => {
              setShowProfile(true);
              setMobileMenuOpen(false);
            }}
            className="hover:underline flex items-center gap-2 text-lg text-left"
          >
            <FaUser /> Profile
          </button>
        </div>
      )}

      {/* Profile modal */}
      <ProfileToast isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
}
