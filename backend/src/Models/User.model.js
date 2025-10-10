const mongoose = require("mongoose");



const userAddressSchema = new mongoose.Schema({
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    pincode: {
        type: String,
    },
    state: {
        type: String,
    },

})




const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        select: false,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    address: [
        userAddressSchema
    ]
}, { timestamps: true })


const User = mongoose.model("User", UserModel);

module.exports = User;