import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, UserPlus, FileSpreadsheet, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ManageUsers() {
  const { register, handleSubmit, reset } = useForm();
  
  // Added loading states for better UX
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onManualSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/api/admin/add-student`, data);
      alert(response.data.message);
      reset();
    } catch (error) {
      console.error("API Error:", error);
      alert(error.response?.data?.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/admin/upload-students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(`Success! ${response.data.count} students uploaded to Database.`);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error uploading file. Check terminal.");
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = null;
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      
      {/* LEFT: Manual Entry Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Add Single Student</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manual Entry</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-4">
          
          <div className="relative group/input">
            <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-emerald-500 uppercase tracking-widest transition-colors z-10">
              Full Name
            </span>
            <input 
              {...register("name", { required: true })} 
              placeholder="e.g. Ali Khan" 
              className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-transparent rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 transition-all placeholder:text-slate-300" 
            />
          </div>

          <div className="relative group/input">
            <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-emerald-500 uppercase tracking-widest transition-colors z-10">
              Roll Number
            </span>
            <input 
              {...register("rollNumber", { required: true })} 
              placeholder="e.g. 2024cs643" 
              className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-transparent rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 transition-all placeholder:text-slate-300" 
            />
          </div>

          <div className="relative group/input">
            <span className="absolute left-4 top-3 text-[9px] font-black text-slate-400 group-focus-within/input:text-emerald-500 uppercase tracking-widest transition-colors z-10">
              Password
            </span>
            <input 
              type="password" 
              {...register("password", { required: true })} 
              placeholder="••••••••" 
              className="w-full pt-8 pb-3 px-4 text-sm font-semibold text-slate-700 bg-slate-50 border border-transparent rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 transition-all placeholder:text-slate-300" 
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 mt-2 font-black text-white uppercase tracking-widest bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-teal-500 rounded-2xl shadow-lg transition-all disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {isSubmitting ? "Creating..." : "Create Student"}
          </motion.button>
        </form>
      </motion.div>

      {/* RIGHT: Excel Upload */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 bg-white border border-slate-200/60 shadow-xl shadow-slate-100/50 rounded-[2.5rem] flex flex-col"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Bulk Upload</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Excel Data Import</p>
          </div>
        </div>
        
        {/* INTERACTIVE DROPZONE */}
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-slate-300 rounded-[2rem] bg-slate-50/50 hover:bg-teal-50/30 hover:border-teal-400 transition-all group overflow-hidden">
          
          {/* Invisible File Input filling the whole box */}
          <input 
            type="file" 
            accept=".csv, .xlsx, .xls" 
            onChange={onFileUpload} 
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
          />
          
          <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
            {isUploading ? (
               <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            ) : (
               <Upload className="w-8 h-8 text-teal-400 group-hover:text-teal-500 transition-colors" />
            )}
          </div>
          
          <span className="block mb-3 text-sm font-bold text-slate-700">
            {isUploading ? "Processing File..." : "Click or drag file to upload"}
          </span>
          
          <span className="px-4 py-2 text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors">
            Select .xlsx File
          </span>
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-1">Data Requirement</p>
          <p className="text-sm font-medium text-amber-900/70">
            The Excel file must contain exactly three columns: <span className="font-bold text-amber-900">Name</span>, <span className="font-bold text-amber-900">RollNo</span>, and <span className="font-bold text-amber-900">Password</span>.
          </p>
        </div>
      </motion.div>

    </div>
  );
}