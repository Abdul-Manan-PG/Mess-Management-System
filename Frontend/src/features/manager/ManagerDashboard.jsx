import { useNavigate } from "react-router-dom";
import { Utensils, LogOut } from "lucide-react";
import { motion } from "framer-motion";

// Import our separated components
import LiveCounts from "./LiveCounts";
import WeeklyMenu from "./WeeklyMenu";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-orange-100">
      
      {/* PREMIUM GLASS NAVBAR */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* Manager Accent: Orange/Amber Gradient */}
            <div className="bg-gradient-to-tr from-orange-600 to-amber-500 p-2 rounded-xl">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tighter uppercase italic text-slate-800">
                Mess<span className="text-orange-600">Pro</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                Manager
              </span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-red-500 transition-colors flex items-center gap-2 bg-slate-100 rounded-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </nav>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto mt-12 px-6 pb-20">
        
        {/* HERO SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
            Manager <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Portal</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">Manage the weekly cuisine and monitor live acceptance.</p>
        </motion.header>

        {/* 12-Column Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
          
          {/* LEFT AREA: Live Counts (4/12 columns, sticky on desktop, TOP on mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-28">
              <LiveCounts />
            </div>
          </motion.div>

          {/* RIGHT AREA: Weekly Menu (8/12 columns for massive editing space) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 min-w-0"
          >
            <WeeklyMenu />
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}