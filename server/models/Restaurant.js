const mongoose=require("mongoose")

const {Schema}=mongoose

const { v4: uuidv4 } = require('uuid');
const restaurantSchema = new Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4 
    },

    name: { type: String, required: true },
    location: {
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lon: { type: Number }
      }
    },
    menu: [{ type: Schema.Types.ObjectId, ref: 'FoodItem' }],
    contact: {
      phone: { type: String },  
      email: { type: String }
    }
  });
  
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  module.exports = Restaurant;
  