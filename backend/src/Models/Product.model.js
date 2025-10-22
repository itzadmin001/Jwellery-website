const mongoose = require("mongoose");

const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    slug: {
        type: String,
        trim: true,
        maxLength: 200,
        index: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    collection: {
        type: String,
        default: ""
    },
    material: {
        type: String,
        default: ""
    },
    weight: {
        type: String,
        default: ""
    },
    dimensions: {
        type: String,
        default: ""
    },
    sku: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    features: {
        type: [String],
        default: []
    },

    image: {
        type: String,
        required: true
    },

    relatedImage: {
        type: [String],
        default: []
    },

    certifications: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    },
    metaTitle: {
        type: String,
        default: ""
    },
    metaDescription: {
        type: String,
        default: ""
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", ProductModel);

module.exports = Product;
