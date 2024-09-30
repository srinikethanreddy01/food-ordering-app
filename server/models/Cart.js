const mongoose=require("mongoose");


const Schema=new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],


})

const Cart=mongoose.model('Cart',Schema);
module.exports=Cart;