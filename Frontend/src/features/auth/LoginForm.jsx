import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./authSchema.js";
import axios from "axios";
import { motion } from "framer-motion";
import { Utensils, Lock, User, Loader2, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        rollNumber: data.identifier,
        password: data.password
      });

      const { token, user } = response.data;

      // Save data
      localStorage.clear();
      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentName", user.name);
      localStorage.setItem("userRole", user.role); // Save the role!
      localStorage.setItem("studentInfo", JSON.stringify(user));

      // Redirect based on the role from the database
      if (user.role === "manager") {
        navigate("/manager-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100">
      
      {/* LEFT SIDE - BRANDING (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 overflow-hidden flex-col justify-between">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
            Mess<span className="text-blue-400">Pro</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
            Streamline your dining experience.
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            The complete management system for students, managers, and administrators.
          </p>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} MessPro System
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-800">
              Mess<span className="text-blue-600">Pro</span>
            </span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Identifier Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Roll Number / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 2024cs643 or admin"
                  {...register("identifier")}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                />
              </div>
              {errors.identifier && (
                <p className="text-xs font-bold text-red-500 ml-1 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                />
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-red-500 ml-1 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Root Error Message */}
            {errors.root && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.root.message}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 mt-8 font-black text-white uppercase tracking-widest bg-slate-900 hover:bg-blue-600 rounded-2xl shadow-xl shadow-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </motion.button>
            
          </form>
        </motion.div>
      </div>

    </div>
  );
}