import { useState } from 'react';
import { CalendarDays, Save } from 'lucide-react';
import axios from 'axios'
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyMenu() {
  const [weekMenu, setWeekMenu] = useState(
    DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = { lunch: '', dinner: '' };
      return acc;
    }, {})
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (day, meal, value) => {
    setWeekMenu(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: value }
    }));
  };

  // const handleSaveMenu = async () => {
  //   setIsSaving(true);
  //   await new Promise(resolve => setTimeout(resolve, 800));
  //   console.log("Weekly Menu Saved:", weekMenu);
  //   setIsSaving(false);
  // };

  const handleSaveMenu = async () => {
  setIsSaving(true);
  try {
    // Send the weekMenu object directly to the backend
    const response = await axios.post('http://localhost:5000/api/manager/update-menu', weekMenu);
    
    alert(response.data.message);
  } catch (error) {
    console.error("Save Error:", error);
    alert("Failed to save menu");
  } finally {
    setIsSaving(false);
  }
};

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
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Scrollable Menu List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="p-3 border border-transparent rounded-lg bg-zinc-50 hover:border-zinc-200 hover:bg-zinc-100/50 transition-colors">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">{day}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input 
                  type="text"
                  placeholder="Lunch"
                  value={weekMenu[day].lunch}
                  onChange={(e) => handleInputChange(day, 'lunch', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border rounded-md border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                />
              </div>
              <div>
                <input 
                  type="text"
                  placeholder="Dinner"
                  value={weekMenu[day].dinner}
                  onChange={(e) => handleInputChange(day, 'dinner', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border rounded-md border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}