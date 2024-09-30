const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const schema = new mongoose.Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4 // Generate a unique ID by default
    },
    // uniqueId: { type: String, required: true, unique: true, default: () => require('uuid').v4() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    phone: { type: String },
    address: { type: String },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]

    
})

const Customer = mongoose.model('Customer', schema);

module.exports = Customer;