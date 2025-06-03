import {
  BarChart3,
  Calendar,
  Film,
  MapPin,
  Settings,
  Ticket,
  Users,
  Home,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { title: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { title: "Movies", icon: Film, path: "/admin/movies" },
  { title: "Theaters", icon: MapPin, path: "/admin/theatres" },
  { title: "Shows", icon: Calendar, path: "/admin/shows" },
  { title: "Bookings", icon: Ticket, path: "/admin/bookings" },
  { title: "Users", icon: Users, path: "/users" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Schedules", icon: Calendar, path: "/schedules" },
  { title: "Revenue", icon: TrendingUp, path: "/revenue" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu open state
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white shadow-md"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-700 text-white
          flex flex-col transition-transform duration-300 z-50

          ${collapsed ? "w-16" : "w-64"}
          md:relative md:translate-x-0
          
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            {!collapsed && <div>
              <h2 className="font-bold text-lg text-red-500">MovieAdmin</h2>
              <p className="text-xs text-gray-400">Booking Dashboard</p>
            </div>}
          </div>

          <div className="flex items-center gap-2">
            {/* Collapse toggle button (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:inline text-gray-400 hover:text-red-500 transition"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Close button (mobile only) */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-gray-400 hover:text-red-500 transition"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-red-700 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <button className="flex items-center gap-3 text-sm text-gray-400 hover:text-red-500 transition w-full">
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
