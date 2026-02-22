import { useNavigate } from "react-router-dom";
import { Utensils, LogOut } from "lucide-react";

// Import our separated components
import LiveCounts from "./components/LiveCounts";
import WeeklyMenu from "./components/WeeklyMenu";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation Bar with subtle shadow */}
      <nav className="sticky top-0 z-20 px-4 py-4 bg-white border-b border-zinc-200 shadow-sm sm:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl font-bold text-zinc-900">Manager Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Layout Container using max-w-7xl */}
      <main className="max-w-7xl mx-auto mt-6 sm:mt-8 px-4 sm:px-8 pb-12">
        <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row lg:items-start">
          {/* LEFT AREA: Live Counts */}
          <div className="flex-1 min-w-0">
            <LiveCounts />
          </div>

          {/* RIGHT AREA: Weekly Menu Sidebar */}
          {/* Automatically handles width on mobile, locks to 400px on desktop */}
          <div className="w-full lg:w-100 lg:sticky lg:top-24 shrink-0">
            <WeeklyMenu />
          </div>
        </div>
      </main>
    </div>
  );
}
