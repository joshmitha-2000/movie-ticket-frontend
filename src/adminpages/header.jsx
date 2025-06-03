import { useEffect, useRef, useState } from "react";
import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate=useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const user = {
    name: "Admin",
    email: "admin@.com",
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // You can add toast or navigate to login here
    navigate("/");
  };

  return (
    <header className="w-full bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between text-white">
      <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>

      <div className="flex items-center gap-6 relative">
        <button
          className="text-gray-400 hover:text-red-500 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <UserCircle className="w-6 h-6 text-red-600" />
          <span className="hidden sm:block text-sm font-semibold text-gray-300">
            Admin
          </span>
        </div>

        {showMenu && (
          <div
            ref={dropdownRef}
            id="profile-dropdown"
            className="absolute top-12 right-0 bg-white text-black shadow-lg rounded-lg p-4 w-60 z-50"
          >
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600 mb-3">{user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-1.5 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

