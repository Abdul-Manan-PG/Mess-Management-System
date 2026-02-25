import { useState } from "react";
import { Users, UserCog, Clock, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { id: "users", label: "Manage Students", icon: Users },
    { id: "managers", label: "Create Manager", icon: UserCog },
    { id: "settings", label: "Meal Timings", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* PREMIUM GLASS NAVBAR */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* Admin Accent: Emerald/Teal Gradient */}
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tighter uppercase italic text-slate-800">
                Mess<span className="text-emerald-600">Pro</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                Admin
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

      <main className="max-w-7xl mx-auto mt-12 px-6 pb-20">
        
        {/* HERO SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Admin</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">Manage users, roles, and global system configurations.</p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR NAVIGATION */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-72 shrink-0 space-y-4"
          >
            <div className="sticky top-28 bg-white p-4 border border-slate-200/60 rounded-[2rem] shadow-xl shadow-slate-100/50">
              <h3 className="px-4 mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Control Panel
              </h3>
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: isActive ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-200"
                          : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          {/* MAIN CONTENT AREA */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            {/* AnimatePresence allows smooth crossfading between tabs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "users" && <ManageUsers />}
                {activeTab === "managers" && <CreateManager />}
                {activeTab === "settings" && <MealSettings />}
              </motion.div>
            </AnimatePresence>
          </motion.main>

        </div>
      </main>
    </div>
  );
}