const mongoose=require("mongoose")
const {Schema}=mongoose

const foodItemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    imageUrl: { type: String } 
  });
  
  const FoodItem = mongoose.model('FoodItem', foodItemSchema);
  module.exports = FoodItem;
  