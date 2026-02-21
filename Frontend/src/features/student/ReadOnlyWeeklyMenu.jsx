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



import { useState, useEffect } from 'react'; // 1. Import useEffect
import { CalendarDays } from 'lucide-react';
import axios from 'axios';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ReadOnlyWeeklyMenu() {
  // 2. Initialize state as null or empty
  const [weekMenu, setWeekMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Fetch data when the component opens
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/manager/get-menu');
        setWeekMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // 4. Show a loading state while waiting for the DB
  if (loading) return <div className="p-4 text-center">Loading Menu...</div>;
  if (!weekMenu) return <div className="p-4 text-center">No menu available yet.</div>;

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
                {/* Use the data from the API */}
                <span className="text-zinc-800">{weekMenu[day]?.lunch || 'N/A'}</span>
              </div>
              <div className="p-2 text-sm bg-white border rounded-md border-zinc-100 shadow-sm">
                <span className="block mb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Dinner</span>
                {/* Use the data from the API */}
                <span className="text-zinc-800">{weekMenu[day]?.dinner || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}