import { useState } from "react";
import { Users, UserCog, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import our new sub-components
import ManageUsers from "./ManageUsers";
import CreateManager from "./CreateManager";
import MealSettings from "./MealSettings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation Bar */}
      <nav className="px-8 py-4 bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-zinc-900">Admin Portal</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto mt-8 gap-8 px-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 space-y-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "users"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Students
          </button>

          <button
            onClick={() => setActiveTab("managers")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "managers"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <UserCog className="w-4 h-4" />
            Create Manager
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            Meal Timings
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "managers" && <CreateManager />}
          {activeTab === "settings" && <MealSettings />}
        </main>
      </div>
    </div>
  );
}
