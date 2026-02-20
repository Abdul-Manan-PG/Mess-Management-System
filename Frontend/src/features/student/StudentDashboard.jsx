import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, LogOut, Check, X, Snowflake } from "lucide-react";
import ReadOnlyWeeklyMenu from "./ReadOnlyWeeklyMenu";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [menu] = useState({
    lunch: "Chicken Biryani",
    dinner: "Daal Mash & Roti",
  });
  const [mealStatus, setMealStatus] = useState({ lunch: null, dinner: null });
  const [freezeInfo, setFreezeInfo] = useState({
    isFrozen: false,
    fromDate: "",
    toDate: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleMealDecision = (mealType, decision) => {
    setMealStatus((prev) => ({ ...prev, [mealType]: decision }));
  };

  const toggleFreeze = (e) => {
    e.preventDefault();
    if (freezeInfo.isFrozen) {
      setFreezeInfo({ isFrozen: false, fromDate: "", toDate: "" });
      alert("Your mess account has been UNFROZEN.");
    } else {
      if (!freezeInfo.fromDate || !freezeInfo.toDate) {
        alert("Please select both start and end dates to freeze your account.");
        return;
      }
      setFreezeInfo({ ...freezeInfo, isFrozen: true });
      alert(
        `Account FROZEN from ${freezeInfo.fromDate} to ${freezeInfo.toDate}.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="sticky top-0 z-20 px-8 py-4 bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-zinc-900">Student Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <main className="max-w-[1400px] mx-auto mt-8 px-8 pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* LEFT AREA: Freeze Controls & Daily Broadcasts */}
          <div className="flex-1 space-y-6">
            {/* Freeze Account Section */}
            <section
              className={`p-6 border shadow-sm rounded-xl transition-colors ${
                freezeInfo.isFrozen
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Snowflake
                  className={`w-5 h-5 ${freezeInfo.isFrozen ? "text-blue-600" : "text-zinc-500"}`}
                />
                <h2 className="text-lg font-semibold text-zinc-900">
                  {freezeInfo.isFrozen
                    ? "Account is Currently Frozen"
                    : "Freeze Mess Account"}
                </h2>
              </div>

              <form
                onSubmit={toggleFreeze}
                className="flex flex-col items-end gap-4 md:flex-row"
              >
                <div className="w-full flex-1">
                  <label className="block mb-1 text-sm font-medium text-zinc-700">
                    From Date
                  </label>
                  <input
                    type="date"
                    disabled={freezeInfo.isFrozen}
                    value={freezeInfo.fromDate}
                    onChange={(e) =>
                      setFreezeInfo({ ...freezeInfo, fromDate: e.target.value })
                    }
                    className="w-full p-2 border rounded-md bg-zinc-50 disabled:opacity-50"
                  />
                </div>
                <div className="w-full flex-1">
                  <label className="block mb-1 text-sm font-medium text-zinc-700">
                    To Date
                  </label>
                  <input
                    type="date"
                    disabled={freezeInfo.isFrozen}
                    value={freezeInfo.toDate}
                    onChange={(e) =>
                      setFreezeInfo({ ...freezeInfo, toDate: e.target.value })
                    }
                    className="w-full p-2 border rounded-md bg-zinc-50 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full md:w-auto px-6 py-2 font-medium text-white rounded-md transition-colors ${freezeInfo.isFrozen ? "bg-zinc-900 hover:bg-zinc-800" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {freezeInfo.isFrozen ? "Unfreeze Now" : "Freeze Account"}
                </button>
              </form>
            </section>

            {/* Daily Broadcast Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {["lunch", "dinner"].map((meal) => (
                <div
                  key={meal}
                  className="relative p-6 overflow-hidden bg-white border shadow-sm rounded-xl border-zinc-200"
                >
                  {freezeInfo.isFrozen && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                      <span className="px-4 py-1.5 text-sm font-medium text-white rounded-full bg-zinc-900">
                        Frozen
                      </span>
                    </div>
                  )}
                  <h3 className="mb-2 text-sm font-medium tracking-wider uppercase text-zinc-500">
                    Today's {meal}
                  </h3>
                  <p className="mb-6 text-2xl font-bold text-zinc-900">
                    {menu[meal]}
                  </p>

                  {mealStatus[meal] ? (
                    <div
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium ${mealStatus[meal] === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {mealStatus[meal] === "accepted" ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                      You {mealStatus[meal]} this meal
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleMealDecision(meal, "accepted")}
                        className="flex items-center justify-center flex-1 gap-2 py-2.5 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleMealDecision(meal, "rejected")}
                        className="flex items-center justify-center flex-1 gap-2 py-2.5 font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT AREA: Weekly Menu Sidebar */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-24 h-[calc(100vh-120px)] shrink-0">
            <ReadOnlyWeeklyMenu />
          </div>
        </div>
      </main>
    </div>
  );
}
