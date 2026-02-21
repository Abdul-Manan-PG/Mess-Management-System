// import { CalendarDays } from 'lucide-react';

// const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// export default function ReadOnlyWeeklyMenu() {
//   // Mock Data: This will later be fetched from the backend so it matches the Manager's input
//   const weekMenu = {
//     Monday: { lunch: 'Chicken Biryani', dinner: 'Daal Mash & Roti' },
//     Tuesday: { lunch: 'Aloo Gosht', dinner: 'Mix Vegetable' },
//     Wednesday: { lunch: 'Chicken Karahi', dinner: 'Chana Daal' },
//     Thursday: { lunch: 'Beef Pulao', dinner: 'Kofta' },
//     Friday: { lunch: 'Fish & Chips', dinner: 'Nihari' },
//     Saturday: { lunch: 'Macaroni', dinner: 'BBQ' },
//     Sunday: { lunch: 'Halwa Puri', dinner: 'Chicken Tikka' },
//   };

//   return (
//     <div className="flex flex-col h-full bg-white border shadow-sm rounded-xl border-zinc-200">
      
//       {/* Sidebar Header */}
//       <div className="flex items-center p-4 border-b border-zinc-100">
//         <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
//           <CalendarDays className="w-5 h-5 text-blue-600" />
//           This Week's Menu
//         </h2>
//       </div>

//       {/* Scrollable Menu List (Read-Only) */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
//         {DAYS_OF_WEEK.map((day) => (
//           <div key={day} className="p-3 border border-transparent rounded-lg bg-zinc-50">
//             <h3 className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">{day}</h3>
            
//             <div className="grid grid-cols-2 gap-2">
//               <div className="p-2 text-sm bg-white border rounded-md border-zinc-100 shadow-sm">
//                 <span className="block mb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Lunch</span>
//                 <span className="text-zinc-800">{weekMenu[day].lunch}</span>
//               </div>
//               <div className="p-2 text-sm bg-white border rounded-md border-zinc-100 shadow-sm">
//                 <span className="block mb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Dinner</span>
//                 <span className="text-zinc-800">{weekMenu[day].dinner}</span>
//               </div>
//             </div>

//           </div>
//         ))}
//       </div>
      
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { CalendarDays, AlertCircle, RefreshCw } from 'lucide-react'; // Added icons for error/retry
import axios from 'axios';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ReadOnlyWeeklyMenu() {
  const [weekMenu, setWeekMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Added error state

  // Extracted fetch function so we can reuse it for the "Try Again" button
  const fetchMenu = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get('http://localhost:5000/api/manager/get-menu');
      setWeekMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError(true); // Trigger error UI if fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Show Error UI with Try Again button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400] bg-white border shadow-sm rounded-xl border-zinc-200 p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-zinc-900">Failed to load menu</h3>
          <p className="text-sm text-zinc-500">There was a problem connecting to the server.</p>
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

  // Show Skeleton Loading Animation matching the component's layout
  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white border shadow-sm rounded-xl border-zinc-200">
        <div className="flex items-center p-4 border-b border-zinc-100">
          <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            This Week's Menu
          </h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-3 border border-transparent rounded-lg bg-zinc-50 animate-pulse">
              <div className="w-20 h-4 mb-3 bg-zinc-200 rounded"></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-14 bg-zinc-200 rounded-md"></div>
                <div className="h-14 bg-zinc-200 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback if data is empty but request succeeded
  if (!weekMenu) return <div className="p-4 text-center">No menu available yet.</div>;

  // Main Render (Unchanged)
  return (
    <div className="flex flex-col h-full bg-white border shadow-sm rounded-xl border-zinc-200">
      <div className="flex items-center p-4 border-b border-zinc-100">
        <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          This Week's Menu
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="p-3 border border-transparent rounded-lg bg-zinc-50">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">{day}</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 text-sm bg-white border rounded-md border-zinc-100 shadow-sm">
                <span className="block mb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Lunch</span>
                <span className="text-zinc-800">{weekMenu[day]?.lunch || 'N/A'}</span>
              </div>
              <div className="p-2 text-sm bg-white border rounded-md border-zinc-100 shadow-sm">
                <span className="block mb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Dinner</span>
                <span className="text-zinc-800">{weekMenu[day]?.dinner || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}