import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, LogOut, Check, X, Snowflake } from "lucide-react";
import axios from "axios";
import ReadOnlyWeeklyMenu from "./ReadOnlyWeeklyMenu";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // 1. HELPERS
  // ------------------------------------------------------------------
  const isPastTime = (endTimeString) => {
    if (!endTimeString) return false;
    const [endHour, endMinute] = endTimeString.split(':').map(Number);
    const now = new Date();
    return now.getHours() > endHour || (now.getHours() === endHour && now.getMinutes() >= endMinute);
  };

  const getMealLabel = (mealType, endTimeFromDB) => {
    if (!endTimeFromDB) return "Meal Info";
    const pastCutoff = isPastTime(endTimeFromDB);

    if (mealType === "lunch") return pastCutoff ? "Tomorrow's Lunch" : "Today's Lunch";
    if (mealType === "dinner") return pastCutoff ? "Tomorrow's Dinner" : "Today's Dinner";
    return "Meal Info";
  };

  // 2. STATE MANAGEMENT
  // ------------------------------------------------------------------
  const [timings, setTimings] = useState({ lunchEnd: "", dinnerEnd: "" });
  const [menu, setMenu] = useState({ lunch: "Loading...", dinner: "Loading..." });
  const [mealStatus, setMealStatus] = useState({ lunch: null, dinner: null });
  const [freezeInfo, setFreezeInfo] = useState({ isFrozen: false, fromDate: "", toDate: "" });

  // 3. DATA FETCHING
  // ------------------------------------------------------------------
//  useEffect(() => {
//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("studentToken");
//       const headers = { Authorization: `Bearer ${token}` };

//       // --- STEP A: Get Timings FIRST ---
//       // We need these timings to know which dates to fetch next
//       const timingRes = await axios.get("http://localhost:5000/api/student/meal-timings", { headers });
//       const { lunchEnd, dinnerEnd } = timingRes.data;
      
//       // Update state so the UI (labels) can use them
//       setTimings({ lunchEnd, dinnerEnd });

//       // --- STEP B: Calculate Dates based on Timings ---
//       const getDynamicTargetDate = (endTimeString) => {
//         const target = new Date();
//         // If current time is past the end time, target tomorrow
//         if (isPastTime(endTimeString)) {
//           target.setDate(target.getDate() + 1);
//         }
//         return target.toISOString().split('T')[0];
//       };

//       const lunchDate = getDynamicTargetDate(lunchEnd);
//       const dinnerDate = getDynamicTargetDate(dinnerEnd);

//       // --- STEP C: Fetch Meal and Freeze Status ---
//       // Now that we have lunchDate and dinnerDate, we can fetch the rest
//       const [freezeRes, mealRes] = await Promise.all([
//         axios.get("http://localhost:5000/api/student/get-freeze-status", { headers }),
//         axios.get("http://localhost:5000/api/student/meal-status", { 
//           headers, 
//           params: { lunchDate, dinnerDate } 
//         }),
//       ]);

//       // --- STEP D: Update States ---
//       setFreezeInfo({
//         isFrozen: freezeRes.data["freeze-status"],
//         fromDate: freezeRes.data["starting date"],
//         toDate: freezeRes.data["ending date"],
//       });

//       setMenu({
//         lunch: mealRes.data.lunch || "Not specified",
//         dinner: mealRes.data.dinner || "Not specified",
//       });

//       setMealStatus({
//         lunch: mealRes.data["lunch-status"],
//         dinner: mealRes.data["dinner-status"],
//       });

//     } catch (error) {
//       console.error("Dashboard Sync Error:", error);
//     }
//   };

//   fetchDashboardData();
// }, []);
 useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Step A: Get Timings
      const timingRes = await axios.get("http://localhost:5000/api/student/meal-timings", { headers });
      const { lunchEnd, dinnerEnd } = timingRes.data;
      setTimings({ lunchEnd, dinnerEnd });

      // Step B: Calculate Dates
      const getDynamicTargetDate = (endTimeString) => {
        const target = new Date();
        if (isPastTime(endTimeString)) {
          target.setDate(target.getDate() + 1);
        }
        return target.toISOString().split('T')[0];
      };

      const lunchDate = getDynamicTargetDate(lunchEnd);
      const dinnerDate = getDynamicTargetDate(dinnerEnd);

      // Step C: Fetch ONLY Meal Status (Removed Freeze status call)
      const mealRes = await axios.get("http://localhost:5000/api/student/meal-status", { 
        headers, 
        params: { lunchDate, dinnerDate } 
      });

      // Step D: Update States
      setMenu({
        lunch: mealRes.data.lunch || "Not specified",
        dinner: mealRes.data.dinner || "Not specified",
      });

      setMealStatus({
        lunch: mealRes.data["lunch-status"],
        dinner: mealRes.data["dinner-status"],
      });

    } catch (error) {
      console.error("Meal Display Error:", error);
    }
  };

  fetchDashboardData();
}, []);
  // HANDLERS
  // ------------------------------------------------------------------
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  /**
   * @BACKEND_API_CONTRACT - POST Meal Decision
   * * POST /student/update-meal-status
   * Headers: { "Authorization": "Bearer <token>" }
   * PAYLOAD SENT TO BACKEND (JSON):
   * { "lunch-status": true } OR { "lunch-status": false }
   * OR
   * { "dinner-status": true } OR { "dinner-status": false }
   * * EXPECTED RESPONSE: 
   * 200 OK status. Response body is not strictly used by frontend. 
   */
const handleMealDecision = async (mealType, decision) => {
  try {
    const token = localStorage.getItem("studentToken");
    const headers = { Authorization: `Bearer ${token}` };

    // 1. Get the correct end-time based on the meal type
    const endTime = mealType === "lunch" ? timings.lunchEnd : timings.dinnerEnd;

    // 2. Calculate the target date dynamically using your logic
    const target = new Date();
    if (isPastTime(endTime)) {
      target.setDate(target.getDate() + 1);
    }
    const targetDate = target.toISOString().split('T')[0];

    // 3. Send to Backend
    // Added full URL to match your other axios calls
    await axios.post(
      "http://localhost:5000/api/student/update-meal-status",
      { 
        mealType,    // 'lunch' or 'dinner'
        decision,    // true (Accept) or false (Reject)
        date: targetDate 
      },
      { headers }
    );

    // 4. Update UI State immediately
    setMealStatus((prev) => ({ ...prev, [mealType]: decision }));
    
    console.log(`Successfully marked ${mealType} as ${decision} for ${targetDate}`);
  } catch (error) {
    console.error("Error updating meal:", error);
    alert("Failed to update meal status. Please try again.");
  }
};
  /**
   * @BACKEND_API_CONTRACT - POST Freeze Status Update
   * * POST /update-freeze-status
   * Headers: { "Authorization": "Bearer <token>" }
   * * PAYLOAD SENT TO BACKEND IF FREEZING (JSON):
   * {
   * "freeze-status": true,
   * "starting date": "2024-05-10",
   * "ending date": "2024-05-15"
   * }
   * * PAYLOAD SENT TO BACKEND IF UNFREEZING (JSON):
   * {
   * "freeze-status": false,
   * "starting date": null,
   * "ending date": null
   * }
   * * EXPECTED RESPONSE:
   * 200 OK status. Response body is not strictly used by frontend.
   */
  const toggleFreeze = async (e) => {
    e.preventDefault();

    const isCurrentlyFrozen = freezeInfo.isFrozen;
    
    const payload = isCurrentlyFrozen
      ? {
          "freeze-status": false,
          "starting date": null,
          "ending date": null,
        }
      : {
          "freeze-status": true,
          "starting date": freezeInfo.fromDate,
          "ending date": freezeInfo.toDate,
        };

    if (!isCurrentlyFrozen && (!freezeInfo.fromDate || !freezeInfo.toDate)) {
      alert("Please select both start and end dates to freeze your account.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      await axios.post("/update-freeze-status", payload, { headers });

      if (isCurrentlyFrozen) {
        setFreezeInfo({ isFrozen: false, fromDate: "", toDate: "" });
        alert("Your mess account has been UNFROZEN.");
      } else {
        setFreezeInfo({ ...freezeInfo, isFrozen: true });
        alert(`Account FROZEN from ${freezeInfo.fromDate} to ${freezeInfo.toDate}.`);
      }
    } catch (error) {
      console.error("Error updating freeze status:", error);
      alert("Network error. Could not update freeze status.");
    }
  };

  // RENDER / UI
  // ------------------------------------------------------------------
return (
  <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-blue-100">
    
    {/* PREMIUM GLASS NAVBAR */}
    <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-slate-800">
            Mess<span className="text-blue-600">Pro</span>
          </span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-red-500 transition-colors flex items-center gap-2 bg-slate-100 rounded-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto mt-12 px-6 pb-20">
      
      {/* PERSONALIZED HERO SECTION */}
     <motion.header 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-12"
>
  <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
      {/* 1. Try studentName string. 2. Try parsing object. 3. Final fallback */}
      {localStorage.getItem("studentName") || 
       JSON.parse(localStorage.getItem("studentInfo") || "{}")?.name || 
       "Student"}
    </span>!
  </h2>
  <p className="text-slate-500 font-medium text-lg">Your meal schedule for the next 24 hours.</p>
</motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN (8/12) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* MEAL CARDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["lunch", "dinner"].map((meal, index) => {
              const isAccepted = mealStatus[meal] === true;
              const isRejected = mealStatus[meal] === false;
              const mealLabel = getMealLabel(meal);

              return (
                <motion.div
                  key={meal}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden"
                >
                  <AnimatePresence>
                    {freezeInfo.isFrozen && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-white/40 backdrop-blur-md flex items-center justify-center"
                      >
                        <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-2xl">
                          <Snowflake className="w-4 h-4 animate-pulse" /> Account Frozen
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-start mb-10">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {mealLabel}
                    </span>
                    {isAccepted && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 bg-green-500 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold text-slate-800 mb-10 leading-tight">
                    {menu[meal]}
                  </h3>

                  <div className="space-y-3">
                    {isAccepted ? (
                      <div className="w-full py-4 text-center font-bold text-green-600 bg-green-50/50 border border-green-100 rounded-2xl">
                        Confirmed for Delivery
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMealDecision(meal, true)}
                          className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200"
                        >
                          {isRejected ? "Re-Accept" : "Accept Meal"}
                        </motion.button>
                        
                        {mealStatus[meal] === null && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMealDecision(meal, false)}
                            className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            Skip
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* FREEZE SECTION - MINIMALIST */}
          <motion.section 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${
              freezeInfo.isFrozen ? "bg-blue-600 border-blue-400 shadow-2xl shadow-blue-200" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-5 mb-8">
              <div className={`p-3 rounded-2xl shadow-sm ${freezeInfo.isFrozen ? "bg-white text-blue-600" : "bg-white text-slate-400"}`}>
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className={`text-2xl font-bold ${freezeInfo.isFrozen ? "text-white" : "text-slate-800"}`}>
                Mess Suspension
              </h3>
            </div>

            <form onSubmit={toggleFreeze} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className={`text-[10px] font-black uppercase tracking-widest ${freezeInfo.isFrozen ? "text-blue-100" : "text-slate-400"}`}>Start Date</p>
                <input type="date" value={freezeInfo.fromDate} disabled={freezeInfo.isFrozen} onChange={(e) => setFreezeInfo({...freezeInfo, fromDate: e.target.value})}
                  className="w-full p-4 bg-white border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-blue-400 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <p className={`text-[10px] font-black uppercase tracking-widest ${freezeInfo.isFrozen ? "text-blue-100" : "text-slate-400"}`}>End Date</p>
                <input type="date" value={freezeInfo.toDate} disabled={freezeInfo.isFrozen} onChange={(e) => setFreezeInfo({...freezeInfo, toDate: e.target.value})}
                  className="w-full p-4 bg-white border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-blue-400 transition-all outline-none" />
              </div>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit"
                className={`w-full py-4 font-black rounded-2xl transition-all shadow-xl ${
                  freezeInfo.isFrozen ? "bg-white text-blue-600 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200"
                }`}>
                {freezeInfo.isFrozen ? "ACTIVATE NOW" : "FREEZE ACCOUNT"}
              </motion.button>
            </form>
          </motion.section>
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <div className="sticky top-28 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-100">
            <div className="p-6 bg-slate-900 text-white text-center font-black text-xs tracking-[0.3em] uppercase">
              Weekly Cuisine
            </div>
            <div className="p-2">
              <ReadOnlyWeeklyMenu />
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  </div>
);
}