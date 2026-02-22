import Attendance from '../models/attendence.js';
import Menu from '../models/Menu.js'; // Assuming this holds your weekly menu
import MealTiming from '../models/MealTiming.js';





export const getMealTimings = async (req, res) => {
  try {
    // We find the first (and only) settings document
    let timings = await MealTiming.findOne();
    
    // If no settings exist yet, we send the defaults
    if (!timings) {
      return res.status(200).json({
        lunchEnd: "13:00",
        dinnerEnd: "21:00"
      });
    }

    res.status(200).json(timings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMealStatus = async (req, res) => {
    try {
        const { lunchDate, dinnerDate } = req.query;
        const studentId = req.user.id;

        // 1. Calculate Day Names
        const dayLunch = new Date(lunchDate).toLocaleDateString('en-US', { weekday: 'long' });
        const dayDinner = new Date(dinnerDate).toLocaleDateString('en-US', { weekday: 'long' });

        // 2. Fetch Weekly Menu
        const weeklyMenu = await Menu.findOne();
        
        // 3. Find Student Attendance
        const [lunchRecord, dinnerRecord] = await Promise.all([
            Attendance.findOne({ studentId, date: lunchDate, mealType: 'lunch' }),
            Attendance.findOne({ studentId, date: dinnerDate, mealType: 'dinner' })
        ]);

        // 4. SAFE DATA EXTRACTION
        // This prevents the "500 Error" by checking if weeklyMenu exists before accessing it
        let lunchName = "Not Available";
        let dinnerName = "Not Available";

        if (weeklyMenu && weeklyMenu.menuData) {
            // Check if it's a Map (.get) or a standard Object ([])
            const lunchData = (weeklyMenu.menuData.get) 
                ? weeklyMenu.menuData.get(dayLunch) 
                : weeklyMenu.menuData[dayLunch];
                
            const dinnerData = (weeklyMenu.menuData.get) 
                ? weeklyMenu.menuData.get(dayDinner) 
                : weeklyMenu.menuData[dayDinner];

            if (lunchData) lunchName = lunchData.lunch;
            if (dinnerData) dinnerName = dinnerData.dinner;
        }

        res.status(200).json({
            lunch: lunchName,
            dinner: dinnerName,
            "lunch-status": lunchRecord ? lunchRecord.status : null,
            "dinner-status": dinnerRecord ? dinnerRecord.status : null
        });

    } catch (error) {
        console.error("Backend Error in getMealStatus:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateMealStatus = async (req, res) => {
    try {
        const { mealType, decision, date } = req.body;
        const studentId = req.user.id;

        // Update existing record or create a new one (Upsert)
        await Attendance.findOneAndUpdate(
            { studentId, date, mealType },
            { status: decision },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Function to SAVE or UPDATE timings from Admin panel
export const updateMealTimings = async (req, res) => {
    try {
        const { lunchStart, lunchEnd, dinnerStart, dinnerEnd } = req.body;

        // findOneAndUpdate with {} (empty object) finds the first document.
        // { upsert: true } means "if it doesn't exist, create it".
        const updatedTimings = await MealTiming.findOneAndUpdate(
            {}, 
            { lunchStart, lunchEnd, dinnerStart, dinnerEnd },
            { upsert: true, new: true }
        );

        res.status(200).json(updatedTimings);
    } catch (error) {
        console.error("Error updating timings:", error);
        res.status(500).json({ message: "Failed to update timings", error: error.message });
    }
};  