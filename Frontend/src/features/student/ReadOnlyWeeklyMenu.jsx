import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ReadOnlyWeeklyMenu() {
  const [weekMenu, setWeekMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/manager/get-menu",
      );
      setWeekMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
      // FIX: If the backend returns a 404, it just means the menu is empty.
      // We set error to false so it falls through to the "!weekMenu" fallback screen.
      if (error.response && error.response.status === 404) {
        setError(false);
        setWeekMenu(null);
      } else {
        // Only trigger the red error screen for actual server crashes/network failures
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 1. ERROR STATE (Styled with high contrast, matching error handling)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6 bg-slate-50 rounded-3xl border border-slate-100 m-2">
        <div className="p-4 bg-red-50 text-red-500 rounded-[2rem]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Connection Failed
          </h3>
          <p className="text-sm font-medium text-slate-500">
            Unable to retrieve the weekly menu from the server.
          </p>
        </div>
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchMenu}
          className="flex items-center gap-2 px-8 py-4 text-sm font-black text-white transition-all bg-slate-900 rounded-2xl hover:bg-blue-600 shadow-xl shadow-slate-200 uppercase tracking-widest"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      </div>
    );
  }

  // 2. LOADING SKELETON (Styled to match the new rounded cards)
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-transparent">
        <div className="flex-1 p-2 overflow-y-auto space-y-4 custom-scrollbar h-[500px]">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-5 rounded-3xl bg-slate-50 animate-pulse border border-slate-100"
            >
              <div className="w-24 h-3 mb-5 bg-slate-200 rounded-full"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-white rounded-2xl shadow-sm"></div>
                <div className="h-16 bg-white rounded-2xl shadow-sm"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. FALLBACK STATE
  if (!weekMenu || Object.keys(weekMenu).length === 0) {
    return (
      <div className="p-10 text-center font-bold text-slate-400 bg-slate-50 rounded-3xl m-2 border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
        Menu hasn't been posted yet.
      </div>
    );
  }

  // 4. MAIN RENDER (Premium List)
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Scrollable area optimized for the sticky parent container */}
      <div className="flex-1 p-2 overflow-y-auto space-y-4 custom-scrollbar h-[600px] pr-3">
        {DAYS_OF_WEEK.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 border border-slate-100 rounded-3xl bg-slate-50 hover:bg-blue-50/50 hover:border-blue-100 transition-all group"
          >
            {/* Day Title */}
            <h3 className="mb-4 text-[11px] font-black tracking-[0.2em] text-slate-400 group-hover:text-blue-500 transition-colors uppercase">
              {day}
            </h3>

            {/* Meal Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100/50">
                <span className="block mb-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                  Lunch
                </span>
                <span className="text-sm font-bold text-slate-800 leading-tight block">
                  {weekMenu[day]?.lunch || "N/A"}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-100/50">
                <span className="block mb-1.5 text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                  Dinner
                </span>
                <span className="text-sm font-bold text-slate-800 leading-tight block">
                  {weekMenu[day]?.dinner || "N/A"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
