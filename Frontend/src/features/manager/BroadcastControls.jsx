import { useState } from 'react';
import { Megaphone, CheckCircle2 } from 'lucide-react';

export default function BroadcastControls() {
  const [activeBroadcast, setActiveBroadcast] = useState(null);

  const handleBroadcast = (mealType) => {
    setActiveBroadcast(mealType);
    alert(`${mealType.toUpperCase()} broadcast sent to all students!`);
    // TODO: Connect to backend API
  };

  return (
    <section className="p-6 bg-white border shadow-sm rounded-xl border-zinc-200">
      <h2 className="flex items-center gap-2 mb-4 text-lg font-semibold text-zinc-900">
        <Megaphone className="w-5 h-5 text-zinc-500" />
        Broadcast Meal Poll
      </h2>
      <p className="mb-6 text-sm text-zinc-500">
        Send a notification to all students to accept or reject today's meals. Make sure the weekly menu is updated before broadcasting.
      </p>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <button 
          onClick={() => handleBroadcast('lunch')}
          disabled={activeBroadcast === 'lunch'}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 font-medium text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed"
        >
          {activeBroadcast === 'lunch' ? <CheckCircle2 className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
          {activeBroadcast === 'lunch' ? 'Lunch Broadcasted' : 'Broadcast Lunch'}
        </button>
        
        <button 
          onClick={() => handleBroadcast('dinner')}
          disabled={activeBroadcast === 'dinner'}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {activeBroadcast === 'dinner' ? <CheckCircle2 className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
          {activeBroadcast === 'dinner' ? 'Dinner Broadcasted' : 'Broadcast Dinner'}
        </button>
      </div>
    </section>
  );
}