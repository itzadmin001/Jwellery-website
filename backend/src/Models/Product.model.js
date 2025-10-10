const mongoose = require("mongoose");


const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 30
    },
    slug: {
        type: String,
        maxLength: 30
    },
    image: {
        type: String
    },
    relatedImage: [
        {
            type: String,
        }
    ],
    price: {
        type: Number,
        min: 1
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory"
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Boolean,
        default: true
    },
    sale: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", ProductModel);

module.exports = Product;
