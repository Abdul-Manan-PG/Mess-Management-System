// const dailyCountSchema = new mongoose.Schema({
//   date: { type: String, required: true, unique: true }, // e.g., "2026-02-27"
//   lunch: { type: Number, default: 0 },
//   dinner: { type: Number, default: 0 }
// });


const dailyCountSchema=new mongoose.Schema({
    date:{type:String,required:true,unique:true},
    lunch:{type:Number, default:0},
    dinner:{typr:Number,default:0}
});