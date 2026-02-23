// import { Clock } from 'lucide-react';

// export default function MealSettings() {
//   return (
//     <div className="max-w-2xl p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
//       <div className="flex items-center gap-2 mb-6">
//         <Clock className="w-5 h-5 text-purple-600" />
//         <h2 className="text-lg font-semibold">Broadcast Schedules</h2>
//       </div>

//       <div className="space-y-6">
//         {/* Lunch Section */}
//         <div className="pb-4 border-b border-zinc-100">
//           <h3 className="mb-3 font-medium text-zinc-900">Lunch Hours</h3>
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">Start Time</label>
//               <input type="time" className="w-full p-2 border rounded-md" defaultValue="11:00" />
//             </div>
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">End Time</label>
//               <input type="time" className="w-full p-2 border rounded-md" defaultValue="14:00" />
//             </div>
//           </div>
//         </div>

//         {/* Dinner Section */}
//         <div>
//           <h3 className="mb-3 font-medium text-zinc-900">Dinner Hours</h3>
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">Start Time</label>
//               <input type="time" className="w-full p-2 border rounded-md" defaultValue="18:00" />
//             </div>
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">End Time</label>
//               <input type="time" className="w-full p-2 border rounded-md" defaultValue="21:00" />
//             </div>
//           </div>
//         </div>

//         <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
//           Update Timings
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { Clock, Loader2 } from 'lucide-react';
// import axios from 'axios';

// export default function MealSettings() {
//   // Initialize with empty strings so React knows these are controlled inputs
//   const [timings, setTimings] = useState({
//     lunchStart: "11:00",
//     lunchEnd: "14:00",
//     dinnerStart: "18:00",
//     dinnerEnd: "21:00"
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchCurrentTimings = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/student/meal-timings");
//         if (res.data && res.data.lunchStart) {
//           setTimings(res.data);
//         }
//       } catch (err) {
//         console.error("Error fetching timings:", err);
//       }
//     };
//     fetchCurrentTimings();
//   }, []);

//   const handleUpdate = async () => {
//     setLoading(true);
//     setMessage("");
//     try {
//       // Ensure the URL is exactly what you defined in server.js + adminRoutes.js
//       await axios.post("http://localhost:5000/api/admin/update-timings", timings);
//       setMessage("✅ Timings updated successfully!");
      
//       // Clear message after 3 seconds
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error("Update Error:", err.response?.data || err.message);
//       setMessage("❌ Failed to update timings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
//       <div className="flex items-center gap-2 mb-6">
//         <Clock className="w-5 h-5 text-purple-600" />
//         <h2 className="text-lg font-semibold">Broadcast Schedules</h2>
//       </div>

//       <div className="space-y-6">
//         {/* Lunch Section */}
//         <div className="pb-4 border-b border-zinc-100">
//           <h3 className="mb-3 font-medium text-zinc-900">Lunch Hours</h3>
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">Start Time</label>
//               <input 
//                 type="time" 
//                 className="w-full p-2 border rounded-md" 
//                 value={timings.lunchStart || "11:00"}
//                 onChange={(e) => setTimings({...timings, lunchStart: e.target.value})}
//               />
//             </div>
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">End Time</label>
//               <input 
//                 type="time" 
//                 className="w-full p-2 border rounded-md" 
//                 value={timings.lunchEnd || "14:00"}
//                 onChange={(e) => setTimings({...timings, lunchEnd: e.target.value})}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Dinner Section */}
//         <div>
//           <h3 className="mb-3 font-medium text-zinc-900">Dinner Hours</h3>
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">Start Time</label>
//               <input 
//                 type="time" 
//                 className="w-full p-2 border rounded-md" 
//                 value={timings.dinnerStart || "18:00"}
//                 onChange={(e) => setTimings({...timings, dinnerStart: e.target.value})}
//               />
//             </div>
//             <div className="flex-1">
//               <label className="text-xs text-zinc-500">End Time</label>
//               <input 
//                 type="time" 
//                 className="w-full p-2 border rounded-md" 
//                 value={timings.dinnerEnd || "21:00"}
//                 onChange={(e) => setTimings({...timings, dinnerEnd: e.target.value})}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <button 
//             onClick={handleUpdate}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
//           >
//             {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//             Update Timings
//           </button>
//           {message && <span className={`text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</span>}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { Clock, Loader2, Save, Utensils } from 'lucide-react';
import axios from 'axios';

export default function MealSettings() {
  const [timings, setTimings] = useState({
    lunchStart: "11:00",
    lunchEnd: "14:00",
    dinnerStart: "18:00",
    dinnerEnd: "21:00"
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
      console.log(err.message)
      setMessage("❌ Failed to update timings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* Main Card */}
      <div className="overflow-hidden transition-all duration-300 bg-white border shadow-xl rounded-2xl border-zinc-200/60 hover:shadow-2xl hover:shadow-purple-500/10">
        
        {/* Header Section */}
        <div className="px-6 py-5 border-b bg-zinc-50/50 border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 text-white bg-purple-600 shadow-lg rounded-xl shadow-purple-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-800">Meal Schedules</h2>
                <p className="text-xs font-medium text-zinc-500">Manage dining hall broadcast hours</p>
              </div>
            </div>
            {message && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full animate-in fade-in slide-in-from-top-2 duration-300 ${
                message.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </span>
            )}
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Lunch Section */}
          <section className="relative group">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Lunch Window</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Starts</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 transition-all duration-200 border rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-zinc-700 font-medium" 
                  value={timings.lunchStart || "11:00"}
                  onChange={(e) => setTimings({...timings, lunchStart: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Ends</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 transition-all duration-200 border rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-zinc-700 font-medium" 
                  value={timings.lunchEnd || "14:00"}
                  onChange={(e) => setTimings({...timings, lunchEnd: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Dinner Section */}
          <section className="relative group">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Dinner Window</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Starts</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 transition-all duration-200 border rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-zinc-700 font-medium" 
                  value={timings.dinnerStart || "18:00"}
                  onChange={(e) => setTimings({...timings, dinnerStart: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Ends</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 transition-all duration-200 border rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none text-zinc-700 font-medium" 
                  value={timings.dinnerEnd || "21:00"}
                  onChange={(e) => setTimings({...timings, dinnerEnd: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Action Button */}
          <button 
            onClick={handleUpdate}
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-2 py-4 text-sm font-bold text-white transition-all duration-200 bg-purple-600 rounded-xl hover:bg-purple-700 active:scale-[0.98] active:duration-75 shadow-lg shadow-purple-200 disabled:bg-purple-300 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                Update All Timings
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Subtle Footer Hint */}
      <p className="mt-4 text-center text-zinc-400 text-[10px] uppercase tracking-widest font-semibold">
        Admin Control Panel • System v2.0
      </p>
    </div>
  );
}