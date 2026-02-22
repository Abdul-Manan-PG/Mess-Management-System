import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, LogOut, Check, X, Snowflake } from "lucide-react";
import axios from "axios";
import ReadOnlyWeeklyMenu from "./ReadOnlyWeeklyMenu";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // STATE MANAGEMENT
  // ------------------------------------------------------------------
  const [menu, setMenu] = useState({
    lunch: "Loading...",
    dinner: "Loading...",
  });

  const [mealStatus, setMealStatus] = useState({ lunch: null, dinner: null });
  
  const [freezeInfo, setFreezeInfo] = useState({
    isFrozen: false,
    fromDate: "",
    toDate: "",
  });

  // DATA FETCHING ON COMPONENT MOUNT
  // ------------------------------------------------------------------
  /**
   * @BACKEND_API_CONTRACT - GET Requests on Load
   * * 1. GET /student/get-freeze-status
   * Headers: { "Authorization": "Bearer <token>" }
   * EXPECTED RESPONSE (JSON):
   * {
   * "freeze-status": true | null,
   * "starting date": "YYYY-MM-DD" | null,
   * "ending date": "YYYY-MM-DD" | null
   * }
   * * 2. GET /student/meal-status
   * Headers: { "Authorization": "Bearer <token>" }
   * EXPECTED RESPONSE (JSON):
   * {
   * "lunch-status": true | false | null,
   * "lunch": "String (e.g., Chicken Biryani)",
   * "dinner-status": true | false | null,
   * "dinner": "String (e.g., Daal Mash & Roti)"
   * }
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

        const [freezeRes, mealRes] = await Promise.all([
          axios.get("/student/get-freeze-status", { headers }),
          axios.get("/student/meal-status", { headers }),
        ]);

        // Process Freeze Status
        const freezeData = freezeRes.data;
        if (freezeData["freeze-status"] === true) {
          setFreezeInfo({
            isFrozen: true,
            fromDate: freezeData["starting date"] || "",
            toDate: freezeData["ending date"] || "",
          });
        }

        // Process Meal Status
        const mealData = mealRes.data;
        setMenu({
          lunch: mealData.lunch || "Not specified",
          dinner: mealData.dinner || "Not specified",
        });
        setMealStatus({
          lunch: mealData["lunch-status"], 
          dinner: mealData["dinner-status"], 
        });
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // HANDLERS
  // ------------------------------------------------------------------
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  /**
   * @BACKEND_API_CONTRACT - POST Meal Decision
   * * POST /student/update-meal-status
   * Headers: { "Authorization": "Bearer <token>" }
   * PAYLOAD SENT TO BACKEND (JSON):
   * { "lunch-status": true } OR { "lunch-status": false }
   * OR
   * { "dinner-status": true } OR { "dinner-status": false }
   * * EXPECTED RESPONSE: 
   * 200 OK status. Response body is not strictly used by frontend.
   */
  const handleMealDecision = async (mealType, decision) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      await axios.post(
        "/student/update-meal-status",
        { [`${mealType}-status`]: decision },
        { headers }
      );

      setMealStatus((prev) => ({ ...prev, [mealType]: decision }));
    } catch (error) {
      console.error("Error updating meal:", error);
      alert("Network error. Could not update meal status.");
    }
  };

  /**
   * @BACKEND_API_CONTRACT - POST Freeze Status Update
   * * POST /update-freeze-status
   * Headers: { "Authorization": "Bearer <token>" }
   * * PAYLOAD SENT TO BACKEND IF FREEZING (JSON):
   * {
   * "freeze-status": true,
   * "starting date": "2024-05-10",
   * "ending date": "2024-05-15"
   * }
   * * PAYLOAD SENT TO BACKEND IF UNFREEZING (JSON):
   * {
   * "freeze-status": false,
   * "starting date": null,
   * "ending date": null
   * }
   * * EXPECTED RESPONSE:
   * 200 OK status. Response body is not strictly used by frontend.
   */
  const toggleFreeze = async (e) => {
    e.preventDefault();

    const isCurrentlyFrozen = freezeInfo.isFrozen;
    
    const payload = isCurrentlyFrozen
      ? {
          "freeze-status": false,
          "starting date": null,
          "ending date": null,
        }
      : {
          "freeze-status": true,
          "starting date": freezeInfo.fromDate,
          "ending date": freezeInfo.toDate,
        };

    if (!isCurrentlyFrozen && (!freezeInfo.fromDate || !freezeInfo.toDate)) {
      alert("Please select both start and end dates to freeze your account.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      await axios.post("/update-freeze-status", payload, { headers });

      if (isCurrentlyFrozen) {
        setFreezeInfo({ isFrozen: false, fromDate: "", toDate: "" });
        alert("Your mess account has been UNFROZEN.");
      } else {
        setFreezeInfo({ ...freezeInfo, isFrozen: true });
        alert(`Account FROZEN from ${freezeInfo.fromDate} to ${freezeInfo.toDate}.`);
      }
    } catch (error) {
      console.error("Error updating freeze status:", error);
      alert("Network error. Could not update freeze status.");
    }
  };

  // RENDER / UI
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-50">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-20 px-8 py-4 bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between max-w-350 mx-auto">
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

      {/* MAIN LAYOUT GRID */}
      <main className="max-w-350 mx-auto mt-8 px-8 pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* LEFT AREA: Controls and Daily Meals */}
          <div className="flex-1 space-y-6">
            
            {/* FREEZE ACCOUNT SECTION */}
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
                  className={`w-full md:w-auto px-6 py-2 font-medium text-white rounded-md transition-colors ${
                    freezeInfo.isFrozen ? "bg-zinc-900 hover:bg-zinc-800" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {freezeInfo.isFrozen ? "Unfreeze Now" : "Freeze Account"}
                </button>
              </form>
            </section>

            {/* DAILY BROADCAST CARDS */}
            <div className="grid gap-6 md:grid-cols-2">
              {["lunch", "dinner"].map((meal) => {
                const isAccepted = mealStatus[meal] === true;
                const isRejected = mealStatus[meal] === false;
                const isUndecided = mealStatus[meal] === null;

                return (
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

                    {isAccepted ? (
                      <div className="flex items-center justify-center gap-2 py-3 font-medium text-green-700 bg-green-100 rounded-lg">
                        <Check className="w-5 h-5" />
                        Meal Accepted (Locked)
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {isRejected && (
                          <div className="flex items-center justify-center gap-2 py-2 font-medium text-red-700 bg-red-100 rounded-lg">
                            <X className="w-5 h-5" />
                            You rejected this meal
                          </div>
                        )}

                        <div className="flex gap-3">
                          {(isUndecided || isRejected) && (
                            <button
                              onClick={() => handleMealDecision(meal, true)}
                              className="flex items-center justify-center flex-1 gap-2 py-2.5 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                              <Check className="w-4 h-4" /> {isRejected ? "Change to Accept" : "Accept"}
                            </button>
                          )}

                          {isUndecided && (
                            <button
                              onClick={() => handleMealDecision(meal, false)}
                              className="flex items-center justify-center flex-1 gap-2 py-2.5 font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200"
                            >
                              <X className="w-4 h-4" /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT AREA: Weekly Menu Sidebar */}
          <div className="w-full lg:w-100 lg:sticky lg:top-24 h-[calc(100vh-120px)] shrink-0">
            <ReadOnlyWeeklyMenu />
          </div>

        </div>
      </main>
    </div>
  );
}