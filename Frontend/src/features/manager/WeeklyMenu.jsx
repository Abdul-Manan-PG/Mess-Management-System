import { useState, useEffect } from "react";
import { CalendarDays, Save, AlertCircle, RefreshCw } from "lucide-react";
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

export default function WeeklyMenu() {
  // 1. Core State
  const [weekMenu, setWeekMenu] = useState(
    DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = { lunch: "", dinner: "" };
      return acc;
    }, {}),
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
        "http://localhost:5000/api/manager/get-menu",
      );

      // Merge fetched data with our default structure to prevent undefined errors
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
      // Send the weekMenu object directly to the backend
      const response = await axios.post(
        "http://localhost:5000/api/manager/update-menu",
        weekMenu,
      );
      alert(response.data.message || "Menu saved successfully");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save menu");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. UI: Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-100 bg-white border shadow-sm rounded-xl border-zinc-200 p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-900">
            Failed to load menu
          </h3>
          <p className="text-sm text-zinc-500">
            Could not retrieve the current menu from the server.
          </p>
        </div>
        <button
          onClick={fetchMenu}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  // 5. UI: Loading Skeleton
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white border shadow-sm rounded-xl border-zinc-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Weekly Menu
          </h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-3 border border-transparent rounded-lg bg-zinc-50 animate-pulse"
            >
              <div className="w-20 h-4 mb-3 bg-zinc-200 rounded"></div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="h-14 bg-zinc-200 rounded-md"></div>
                <div className="h-14 bg-zinc-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. UI: Main Editable Menu
  return (
    <div className="flex flex-col h-full bg-white border shadow-sm rounded-xl border-zinc-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-100">
        <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Weekly Menu
        </h2>
        <button
          onClick={handleSaveMenu}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Scrollable Menu List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar lg:max-h-[calc(100vh-160px)]">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-3 border border-transparent rounded-lg bg-zinc-50 hover:border-zinc-200 hover:bg-zinc-100/50 transition-colors"
          >
            <h3 className="mb-3 text-xs font-bold tracking-wider text-zinc-500 uppercase">
              {day}
            </h3>

            {/* RESPONSIVE GRID & COMPACT INPUTS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  Lunch
                </span>
                <input
                  type="text"
                  value={weekMenu[day].lunch}
                  onChange={(e) =>
                    handleInputChange(day, "lunch", e.target.value)
                  }
                  className="w-full pt-6 pb-2 px-3 text-sm bg-white border rounded-md border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  Dinner
                </span>
                <input
                  type="text"
                  value={weekMenu[day].dinner}
                  onChange={(e) =>
                    handleInputChange(day, "dinner", e.target.value)
                  }
                  className="w-full pt-6 pb-2 px-3 text-sm bg-white border rounded-md border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
