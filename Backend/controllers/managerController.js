import Menu from '../models/Menu.js'
import DailyCounts from '../models/DailyCounts.js';

export const updateWeeklyMenu=async (req,res)=>{
    try {
        const newMenu=req.body;
//if menu exist already 
let menu=await Menu.findOne();

if(menu){
menu.menuData=newMenu;
menu.lastUpdated = Date.now();
      await menu.save();
}

else{
    menu=await Menu.create({menuData:newMenu})
}
res.status(200).json({ message: "Weekly Menu updated successfully!", menu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const getWeeklyMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne(); // Find the only menu document
    if (!menu) {
      return res.status(404).json({ message: "No menu found" });
    }
    // We send back menu.menuData because that's where the days are stored
    res.status(200).json(menu.menuData); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getDailyCounts = async (req, res) => {
    try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Find the document for today
        const counts = await DailyCounts.findOne({ date: today });

        // If it exists, send the real numbers. If not, send 0.
        res.status(200).json({
            lunch: counts ? counts.lunch : 0,
            dinner: counts ? counts.dinner : 0
        });
    } catch (error) {
        console.error("Error in getDailyCounts:", error);
        res.status(500).json({ message: "Server Error fetching counts" });
    }
};