import { useState, useEffect } from "react";
import { CalendarDays, Save, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyMenu() {
  // 1. Core State
  const [weekMenu, setWeekMenu] = useState(
    DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = { lunch: "", dinner: "" };
      return acc;
    }, {})
  );

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 2. Fetch Existing Menu on Load
  const fetchMenu = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/manager/get-menu"
      );

      const fetchedMenu = response.data;
      setWeekMenu((prev) => {
        const updatedMenu = { ...prev };
        for (const day of DAYS_OF_WEEK) {
          if (fetchedMenu && fetchedMenu[day]) {
            updatedMenu[day] = {
              lunch: fetchedMenu[day].lunch || "",
              dinner: fetchedMenu[day].dinner || "",
            };
          }
        }
        return updatedMenu;
      });
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 3. Input Handlers & Saving
  const handleInputChange = (day, meal, value) => {
    setWeekMenu((prev) => ({
      ...prev,
      [day]: { ...prev[day], [meal]: value },
    }));
  };

  const handleSaveMenu = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/manager/update-menu",
        weekMenu
      );
      // Optional: Add a toast notification here in a real app
      alert(response.data.message || "Menu saved successfully");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save menu");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. UI: Error State (Styled)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center space-y-6 shadow-xl shadow-slate-100/50">
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Sync Error
          </h3>
          <p className="text-sm font-medium text-slate-500">
            Could not retrieve the current menu.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchMenu}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition-colors bg-slate-900 rounded-xl hover:bg-orange-600 shadow-lg shadow-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </motion.button>
      </div>
    );
  }

  // 5. UI: Loading Skeleton (Styled)
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="space-y-3 animate-pulse">
              <div className="w-20 h-3 bg-slate-200 rounded-full" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
                <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. UI: Main Editable Menu
  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100/50 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black tracking-tight text-slate-800">
            WEEKLY MENU
          </h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveMenu}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white uppercase tracking-widest transition-all bg-gradient-to-r from-slate-900 to-slate-800 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </motion.button>
      </div>

      {/* SCROLLABLE INPUTS */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar lg:max-h-[calc(100vh-180px)]">
        {DAYS_OF_WEEK.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 border border-slate-100/60 rounded-[1.5rem] bg-slate-50/50 hover:bg-white hover:border-orange-100 hover:shadow-lg hover:shadow-orange-100/20 transition-all duration-300 group"
          >
            <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase group-hover:text-orange-500 transition-colors pl-1">
              {day}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* LUNCH INPUT */}
              <div className="relative group/input">
                <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-orange-500 uppercase tracking-widest transition-colors z-10">
                  Lunch
                </span>
                <input
                  type="text"
                  value={weekMenu[day].lunch}
                  onChange={(e) =>
                    handleInputChange(day, "lunch", e.target.value)
                  }
                  placeholder="Enter meal..."
                  className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-white border border-transparent rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-200 focus:shadow-md transition-all placeholder:text-slate-300"
                />
              </div>

              {/* DINNER INPUT */}
              <div className="relative group/input">
                <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-indigo-500 uppercase tracking-widest transition-colors z-10">
                  Dinner
                </span>
                <input
                  type="text"
                  value={weekMenu[day].dinner}
                  onChange={(e) =>
                    handleInputChange(day, "dinner", e.target.value)
                  }
                  placeholder="Enter meal..."
                  className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-white border border-transparent rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 focus:shadow-md transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}