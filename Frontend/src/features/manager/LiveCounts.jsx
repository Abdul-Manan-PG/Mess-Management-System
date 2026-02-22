import { useState, useEffect } from 'react';
import { Users, Utensils, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function LiveCounts() {
  const [counts, setCounts] = useState({ lunch: 0, dinner: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Fetch the initial counts once when the dashboard loads
    const fetchInitialCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/manager/counts');
        setCounts(response.data);
      } catch (err) {
        console.error("Error fetching initial counts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCounts();

    // 2. Open the WebSocket connection to listen for updates
    // Make sure this URL matches your backend server URL
    const socket = io('http://localhost:5000'); 

    // Listen for connection success
    socket.on('connect', () => {
      console.log('Connected to live socket server');
      setError(false);
    });

    // 3. THE LISTENER: Backend will emit 'update_counts' whenever a student clicks accept
    socket.on('update_counts', (newCounts) => {
      console.log("Backend pushed new counts:", newCounts);
      setCounts(newCounts);
    });

    // Listen for connection drops
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setError(true);
    });

    // 4. Cleanup: Close the connection when the manager leaves this page
    return () => {
      socket.off('connect');
      socket.off('update_counts');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <Users className="w-5 h-5 text-zinc-500" />
          Live Acceptance Counts
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-32 bg-zinc-100 border border-zinc-200 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-zinc-100 border border-zinc-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <Users className="w-5 h-5 text-zinc-500" />
          Live Acceptance Counts
        </h2>
        {error && (
           <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
             <AlertCircle className="w-3.5 h-3.5" /> Live connection lost
           </span>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative p-6 overflow-hidden bg-white border shadow-sm rounded-xl border-zinc-200">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Utensils className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium tracking-wider uppercase text-zinc-500">Lunch Attendees</h3>
          <p className="mt-2 text-5xl font-bold text-orange-600">
            {counts.lunch}
          </p>
          <p className="mt-2 text-sm text-zinc-400">students accepted</p>
        </div>

        <div className="relative p-6 overflow-hidden bg-white border shadow-sm rounded-xl border-zinc-200">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Utensils className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium tracking-wider uppercase text-zinc-500">Dinner Attendees</h3>
          <p className="mt-2 text-5xl font-bold text-indigo-600">
            {counts.dinner}
          </p>
          <p className="mt-2 text-sm text-zinc-400">students accepted</p>
        </div>
      </div>
    </div>
  );
}