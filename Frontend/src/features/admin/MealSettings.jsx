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

import { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function MealSettings() {
  // Initialize with empty strings so React knows these are controlled inputs
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
      // Ensure the URL is exactly what you defined in server.js + adminRoutes.js
      await axios.post("http://localhost:5000/api/admin/update-timings", timings);
      setMessage("✅ Timings updated successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      setMessage("❌ Failed to update timings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold">Broadcast Schedules</h2>
      </div>

      <div className="space-y-6">
        {/* Lunch Section */}
        <div className="pb-4 border-b border-zinc-100">
          <h3 className="mb-3 font-medium text-zinc-900">Lunch Hours</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500">Start Time</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                value={timings.lunchStart || "11:00"}
                onChange={(e) => setTimings({...timings, lunchStart: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500">End Time</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                value={timings.lunchEnd || "14:00"}
                onChange={(e) => setTimings({...timings, lunchEnd: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Dinner Section */}
        <div>
          <h3 className="mb-3 font-medium text-zinc-900">Dinner Hours</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500">Start Time</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                value={timings.dinnerStart || "18:00"}
                onChange={(e) => setTimings({...timings, dinnerStart: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500">End Time</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                value={timings.dinnerEnd || "21:00"}
                onChange={(e) => setTimings({...timings, dinnerEnd: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Timings
          </button>
          {message && <span className={`text-sm font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</span>}
        </div>
      </div>
    </div>
  );
}