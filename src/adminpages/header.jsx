import { useState } from "react";
import { Bell, UserCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const user = {
    name: "Admin",
    email: "admin@.com",
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="relative flex items-center gap-4">
        <Bell className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />

        <div onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 cursor-pointer">
          <UserCircle className="w-6 h-6 text-red-600" />
          <span className="hidden sm:inline text-sm font-semibold text-gray-300">Admin</span>
        </div>

        {showMenu && (
          <div className="absolute top-12 right-0 bg-white text-black p-4 rounded-lg shadow-lg w-60 z-50">
            {/* X Button */}
            <div className="flex justify-end">
              <button onClick={() => setShowMenu(false)} aria-label="Close">
                <X className="w-5 h-5 text-gray-500 hover:text-black" />
              </button>
            </div>

            <p className="font-semibold mt-2">{user.name}</p>
            <p className="text-sm text-gray-600 mb-3">{user.email}</p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-1.5 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
