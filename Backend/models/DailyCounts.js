// const dailyCountSchema = new mongoose.Schema({
//   date: { type: String, required: true, unique: true }, // e.g., "2026-02-27"
//   lunch: { type: Number, default: 0 },
//   dinner: { type: Number, default: 0 }
// });

import mongoose from "mongoose";
const dailyCountSchema=new mongoose.Schema({
    date:{type:String,required:true,unique:true},
    lunch:{type:Number, default:0},
    dinner:{type:Number,default:0}
});

export default mongoose.model('DailyCount', dailyCountSchema);