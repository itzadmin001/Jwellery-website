const mongoose = require("mongoose");


const wishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
}, {
    timestamps: true
})


const WishListModel = mongoose.model("wishlist", wishListSchema)

module.exports = WishListModel;