const mongoose = require("mongoose")

const userAddressSchema = new mongoose.Schema({
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    state: {
        type: String,
    },
    phone: {
        type: Number,
    }

})

const Orderschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    product_detail: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "shipped", "delivered"],
        default: "pending"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    order_payment_type: {
        type: Number,
        enum: [1, 2],
        default: 2
        // 1. offline , 2. online

    },
    shippingAddress: userAddressSchema
},
    {
        timestamps: true
    });


const OrderModel = mongoose.model("order", Orderschema)

module.exports = OrderModel