import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  // We use 'Map' because our keys (Monday, Tuesday) are dynamic
  menuData: {
    type: Map,
    of: new mongoose.Schema({
      lunch: String,
      dinner: String
    }, { _id: false }) // _id: false stops Mongoose from adding IDs to every single meal
  },
  lastUpdated: { type: Date, default: Date.now }
});

const Menu = mongoose.models.Menu || mongoose.model('Menu', menuSchema);
export default Menu;