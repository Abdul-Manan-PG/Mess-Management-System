import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "./authSchema.js";
import axios from "axios";
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

  // const onSubmit = async (data) => {
  //   try {
  //     // Simulate network request delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // MOCK LOGIC: Determine role based on input
  //     let userRole = "student";
  //     if (data.identifier.toLowerCase() === "admin") {
  //       userRole = "admin";
  //     } else if (data.identifier.toLowerCase() === "manager") {
  //       userRole = "manager";
  //     }

  //     // --- NEW CODE: Save the user session so ProtectedRoute can see it ---
  //     localStorage.setItem("isAuthenticated", "true");
  //     localStorage.setItem("role", userRole);
  //     // ------------------------------------------------------------------

  //     // Route the user to their specific dashboard
  //     navigate(`/${userRole}-dashboard`, { replace: true });
  //   } catch (error) {
  //     console.log(error.message);
  //     setError("root", { message: "Failed to sign in. Please try again." });
  //   }
  // };
const onSubmit = async (data) => {
    try {
      // 1. Call your real Backend API
      console.log(data.identifier)
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        rollNumber: data.identifier, // Matching your backend expectation
        password: data.password
      });

      // 2. Extract data from the successful response
      const { token, student } = response.data;

      // 3. Save to LocalStorage
      // This is the "Key Card" for the student's browser
      localStorage.clear(); // Wipe old data
      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentName", response.data.user.name);
      localStorage.setItem("role", "student"); // You can expand this for admin/manager later
      localStorage.setItem("studentInfo", JSON.stringify(student));

      // 4. Navigate to the dashboard
     console.log("Login Success, navigating...");
      navigate("/student-dashboard");

    } catch (error) {
      // 5. Handle Errors (e.g., Wrong password or Student not found)
      const errorMessage = error.response?.data?.message || "Failed to sign in. Please try again.";
      setError("root", { message: errorMessage });
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50">
      <div className="w-full max-w-md p-8 bg-white border shadow-sm rounded-2xl border-zinc-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Mess Attendance
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your credentials to access your portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Identifier Input */}
          <div>
            <label
              htmlFor="identifier"
              className="block mb-1 text-sm font-medium text-zinc-700"
            >
              Roll Number / Email
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="e.g., 2024cs643 or admin"
              {...register("identifier")}
              className="w-full px-4 py-2 border rounded-lg bg-zinc-50 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg bg-zinc-50 border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Root Error Message (if API fails) */}
          {errors.root && (
            <p className="text-sm text-center text-red-500">
              {errors.root.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white transition-colors rounded-lg bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
