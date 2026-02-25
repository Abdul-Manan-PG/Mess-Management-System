import { useState, useEffect } from 'react';
import { Clock, Loader2, Save, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function MealSettings() {
  const [timings, setTimings] = useState({
    lunchStart: "",
    lunchEnd: "",
    dinnerStart: "",
    dinnerEnd: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCurrentTimings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/student/meal-timings");
        if (res.data && res.data.lunchStart) {
          setTimings(res.data);
        }
      } catch (err) {
        console.error("Error fetching timings:", err);
      }
    };
    fetchCurrentTimings();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/admin/update-timings", timings);
      setMessage("✅ Timings updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err.message);
      setMessage("❌ Failed to update timings.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-2">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 rounded-[2.5rem] relative overflow-hidden"
      >
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Meal Schedules</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global Timings</p>
            </div>
          </div>
          
          {/* Notification Badge */}
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-sm text-[10px] font-black uppercase tracking-wider ${
                  message.includes('✅') 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}
              >
                {message.includes('✅') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {message.replace(/[✅❌]/g, '').trim()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          
          {/* LUNCH SECTION */}
          <section className="relative p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] group">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full flex items-center gap-1.5 shadow-sm">
              <Utensils className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Lunch Window</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="relative group/input">
                <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-emerald-500 uppercase tracking-widest transition-colors z-10">
                  Starts
                </span>
                <input 
                  type="time" 
                  value={timings.lunchStart || "11:00"}
                  onChange={(e) => setTimings({...timings, lunchStart: e.target.value})}
                  className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-white border border-transparent rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 transition-all" 
                />
              </div>
              <div className="relative group/input">
                <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-emerald-500 uppercase tracking-widest transition-colors z-10">
                  Ends
                </span>
                <input 
                  type="time" 
                  value={timings.lunchEnd || "14:00"}
                  onChange={(e) => setTimings({...timings, lunchEnd: e.target.value})}
                  className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-white border border-transparent rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 transition-all" 
                />
              </div>
            </div>
          </section>

          {/* DINNER SECTION */}
          <section className="relative p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] group">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full flex items-center gap-1.5 shadow-sm">
              <Utensils className="w-3 h-3 text-teal-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Dinner Window</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="relative group/input">
                <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-teal-500 uppercase tracking-widest transition-colors z-10">
                  Starts
                </span>
                <input 
                  type="time" 
                  value={timings.dinnerStart || "18:00"}
                  onChange={(e) => setTimings({...timings, dinnerStart: e.target.value})}
                  className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-white border border-transparent rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-200 transition-all" 
                />
              </div>
              <div className="relative group/input">
                <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-teal-500 uppercase tracking-widest transition-colors z-10">
                  Ends
                </span>
                <input 
                  type="time" 
                  value={timings.dinnerEnd || "21:00"}
                  onChange={(e) => setTimings({...timings, dinnerEnd: e.target.value})}
                  className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-white border border-transparent rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-200 transition-all" 
                />
              </div>
            </div>
          </section>

          {/* Action Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 mt-4 font-black text-white uppercase tracking-widest bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-teal-500 rounded-2xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {loading ? "Updating..." : "Update All Timings"}
          </motion.button>

        </div>
      </motion.div>
      
      {/* Subtle Footer Hint */}
      <p className="mt-6 text-center text-slate-400 text-[9px] uppercase tracking-widest font-bold">
        Admin Control Panel • System v2.0
      </p>
    </div>
  );
}