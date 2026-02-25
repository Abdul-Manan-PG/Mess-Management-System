import { useState, useEffect } from 'react';
import { Users, Utensils, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function LiveCounts() {
  const [counts, setCounts] = useState({ lunch: 0, dinner: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Initial Fetch
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

    // 2. WebSockets for Live Updates
    const socket = io('http://localhost:5000'); 

    socket.on('connect', () => {
      console.log('Connected to live socket server');
      setError(false);
    });

    socket.on('update_counts', (newCounts) => {
      setCounts(newCounts);
    });

    socket.on('disconnect', () => {
      setError(true);
    });

    return () => {
      socket.off('connect');
      socket.off('update_counts');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-black tracking-tight text-slate-800">Live Acceptance Counts</h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-40 bg-slate-50 border border-slate-100 rounded-[2rem] animate-pulse"></div>
          <div className="h-40 bg-slate-50 border border-slate-100 rounded-[2rem] animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-black tracking-tight text-slate-800">Live Counts</h2>
        </div>
        {error && (
           <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
             <AlertCircle className="w-3.5 h-3.5" /> Disconnected
           </span>
        )}
      </div>
      
      {/* This is the crucial change: 
        flex-col makes them stack perfectly in the narrow left column 
      */}
      <div className="flex flex-col gap-6">
        
        {/* LUNCH CARD */}
        <div className="relative p-8 overflow-hidden bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 rounded-[2rem] group hover:border-orange-200 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
            <Utensils className="w-48 h-48" />
          </div>
          <h3 className="mb-2 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 group-hover:text-orange-500 transition-colors">
            Lunch Attendees
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-6xl font-black text-orange-600 tracking-tighter">
              {counts.lunch}
            </p>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-400">students accepted</p>
        </div>

        {/* DINNER CARD */}
        <div className="relative p-8 overflow-hidden bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 rounded-[2rem] group hover:border-indigo-200 transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
            <Utensils className="w-48 h-48" />
          </div>
          <h3 className="mb-2 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 group-hover:text-indigo-500 transition-colors">
            Dinner Attendees
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-6xl font-black text-indigo-600 tracking-tighter">
              {counts.dinner}
            </p>
          </div>
          <p className="mt-2 text-xs font-bold text-slate-400">students accepted</p>
        </div>

      </div>
    </div>
  );
}