const mongoose = require('mongoose');


const Cart = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
    },
    qty: {
        type: Number,
        default: 1,
        min: 1
    }
},
    {
        timestamps: true
    });

const CartModel = mongoose.model("cart", Cart);
module.exports = CartModel;