import Attendance from '../models/attendence.js';
import Menu from '../models/Menu.js'; // Assuming this holds your weekly menu
import MealTiming from '../models/MealTiming.js';

import DailyCount from '../models/DailyCounts.js';



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

// export const updateMealStatus = async (req, res) => {
//     try {
//         const { mealType, decision, date } = req.body;
//         const studentId = req.user.id;

//         // Update existing record or create a new one (Upsert)
//         await Attendance.findOneAndUpdate(
//             { studentId, date, mealType },
//             { status: decision },
//             { upsert: true, new: true }
//         );

//         res.status(200).json({ message: "Status updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




// export const updateMealStatus = async (req, res) => {
//     // 1. Force mealType to lowercase to match DB keys ('lunch' vs 'dinner')
//     const { decision, date } = req.body;
//     const mealType = req.body.mealType.toLowerCase(); 
//     const studentId = req.user.id;

//     console.log(`Update Request: Student ${studentId} | Meal: ${mealType} | Decision: ${decision}`);

//     try {
//         const existingRecord = await Attendance.findOne({ studentId, date, mealType });
        
//         // 2. Calculate increment/decrement
//         let increment = 0;
//         if (decision === true && (!existingRecord || existingRecord.status !== true)) {
//             increment = 1;
//         } else if (decision === false && existingRecord?.status === true) {
//             increment = -1;
//         }

//         console.log(`Logic Result: Incrementing ${mealType} by ${increment}`);

//         // 3. Update Student Record
//         await Attendance.findOneAndUpdate(
//             { studentId, date, mealType },
//             { status: decision },
//             { upsert: true }
//         );

//       // Inside your updateMealStatus controller...

// if (increment !== 0) {
//     // 1. We ONLY want to change the specific mealType (lunch OR dinner)
//     // We use the $inc operator so we don't overwrite the other meal's count
//     const updatedDoc = await DailyCount.findOneAndUpdate(
//         { date: date }, // Find today's document
//         { $inc: { [mealType]: increment } }, // Dynamic key: only increments the one sent
//         { 
//             upsert: true, 
//             returnDocument: 'after',
//             setDefaultsOnInsert: true // Ensures the other meal starts at 0 if the doc is new
//         }
//     );

//     // 2. IMPORTANT: Grab the latest totals for BOTH to broadcast
//     // This ensures the Manager sees the full picture
//     const io = req.app.get('socketio');
//     io.emit('update_counts', {
//         lunch: updatedDoc.lunch || 0,
//         dinner: updatedDoc.dinner || 0
//     });
// }

//         res.status(200).json({ message: "Success" });
//     } catch (error) {
//         console.error("Lunch Update Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };




export const updateMealStatus = async (req, res) => {
    try {
        const { decision, date } = req.body;
        const mealType = req.body.mealType.toLowerCase(); 
        const studentId = req.user.id;

        // 1. DATE CLEANING (The Fix for the "Moving Count" Bug)
        // This converts "2026-02-27T18:00:00Z" or other formats into "2026-02-27"
        // This ensures Lunch and Dinner always land in the SAME document.
        const cleanDate = new Date(date).toISOString().split('T')[0];

        console.log(`Update Request: Student ${studentId} | Meal: ${mealType} | Clean Date: ${cleanDate}`);

        // 2. Find the current state of THIS specific student
        const existingRecord = await Attendance.findOne({ 
            studentId, 
            date: cleanDate, 
            mealType 
        });
        
        // 3. Calculate increment logic (+1, -1, or 0)
        let increment = 0;
        if (decision === true && (!existingRecord || existingRecord.status !== true)) {
            increment = 1;
        } else if (decision === false && existingRecord?.status === true) {
            increment = -1;
        }

        // 4. Update the Student's individual record
        await Attendance.findOneAndUpdate(
            { studentId, date: cleanDate, mealType },
            { status: decision },
            { upsert: true }
        );

        // 5. Update the Daily Counter ONLY if a real change happened
        if (increment !== 0) {
            const updatedDoc = await DailyCount.findOneAndUpdate(
                { date: cleanDate }, 
                { $inc: { [mealType]: increment } }, // Dynamic key update
                { 
                    upsert: true, 
                    returnDocument: 'after', // Modern version of new: true
                    setDefaultsOnInsert: true 
                }
            );

            // 6. BROADCAST: Send both values from the same document
            // If one value doesn't exist yet, we send 0 to keep the UI clean
            const io = req.app.get('socketio');
            io.emit('update_counts', {
                lunch: updatedDoc.lunch || 0,
                dinner: updatedDoc.dinner || 0
            });
            
            console.log(`Broadcasted for ${cleanDate}: Lunch: ${updatedDoc.lunch || 0} Dinner: ${updatedDoc.dinner || 0}`);
        }

        res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        console.error("Critical Update Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
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
            { upsert: true, returnDocument: 'after' }
        );

        res.status(200).json(updatedTimings);
    } catch (error) {
        console.error("Error updating timings:", error);
        res.status(500).json({ message: "Failed to update timings", error: error.message });
    }
};  