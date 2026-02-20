import { useNavigate } from "react-router-dom";
import { Utensils, LogOut } from "lucide-react";

// Import our newly separated components
import LiveCounts from "./LiveCounts";
import BroadcastControls from "./BroadcastControls";
import WeeklyMenu from "./WeeklyMenu";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation Bar */}
      <nav className="px-8 py-4 bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl font-bold text-zinc-900">Manager Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <main className="max-w-[1400px] mx-auto mt-8 px-8 pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* LEFT AREA: Controls & Counts (Takes up remaining flexible space) */}
          <div className="flex-1 space-y-8">
            <LiveCounts />
            <BroadcastControls />
          </div>

          {/* RIGHT AREA: Weekly Menu Sidebar (Fixed width on desktop, sticky) */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-24 h-[calc(100vh-120px)] shrink-0">
            <WeeklyMenu />
          </div>
        </div>
      </main>
    </div>
  );
}
