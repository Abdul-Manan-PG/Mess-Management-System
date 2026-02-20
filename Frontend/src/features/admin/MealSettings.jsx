import { Clock } from 'lucide-react';

export default function MealSettings() {
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
              <input type="time" className="w-full p-2 border rounded-md" defaultValue="11:00" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500">End Time</label>
              <input type="time" className="w-full p-2 border rounded-md" defaultValue="14:00" />
            </div>
          </div>
        </div>

        {/* Dinner Section */}
        <div>
          <h3 className="mb-3 font-medium text-zinc-900">Dinner Hours</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500">Start Time</label>
              <input type="time" className="w-full p-2 border rounded-md" defaultValue="18:00" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500">End Time</label>
              <input type="time" className="w-full p-2 border rounded-md" defaultValue="21:00" />
            </div>
          </div>
        </div>

        <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
          Update Timings
        </button>
      </div>
    </div>
  );
}