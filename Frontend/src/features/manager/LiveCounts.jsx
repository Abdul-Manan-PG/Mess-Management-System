import { useState, useEffect } from 'react';
import { Users, Utensils } from 'lucide-react';

export default function LiveCounts() {
  // Mock State for Live Counts (Will be replaced by WebSockets/API)
  const [counts, setCounts] = useState({ lunch: 12, dinner: 5 });

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
        <Users className="w-5 h-5 text-zinc-500" />
        Live Acceptance Counts
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Lunch Stats */}
        <div className="relative overflow-hidden p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Utensils className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Lunch Attendees</h3>
          <p className="mt-2 text-5xl font-bold text-orange-600">{counts.lunch}</p>
          <p className="mt-2 text-sm text-zinc-400">students accepted</p>
        </div>

        {/* Dinner Stats */}
        <div className="relative overflow-hidden p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Utensils className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Dinner Attendees</h3>
          <p className="mt-2 text-5xl font-bold text-indigo-600">{counts.dinner}</p>
          <p className="mt-2 text-sm text-zinc-400">students accepted</p>
        </div>
      </div>
    </div>
  );
}