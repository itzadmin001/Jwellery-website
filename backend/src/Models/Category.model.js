const mongoose = require("mongoose");


const CategoryModel = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 30
    },
    slug: {
        type: String,
        maxLength: 30
    },
    image: {
        type: String,
        maxLength: 100
    },
    status: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
})

const Category = mongoose.model("Category", CategoryModel);

module.exports = Category;