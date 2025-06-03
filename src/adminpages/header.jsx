// src/components/Header.tsx
import { Bell, Search, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-700 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-white gap-3 sm:gap-0">
      
      {/* Search Bar */}
      <div className="flex items-center w-full sm:max-w-md">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search movies, theaters..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-6">
        <button
          className="text-gray-400 hover:text-red-500 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer select-none">
          <UserCircle className="w-6 h-6 text-red-600" />
          <span className="hidden sm:block text-sm font-semibold text-gray-300">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
