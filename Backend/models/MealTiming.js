import mongoose from 'mongoose';

const mealTimingSchema = new mongoose.Schema({
  lunchStart: { type: String, default: "11:00" },
  lunchEnd: { type: String, default: "14:00" },
  dinnerStart: { type: String, default: "18:00" },
  dinnerEnd: { type: String, default: "21:00" }
});

export default mongoose.model('MealTiming', mealTimingSchema);