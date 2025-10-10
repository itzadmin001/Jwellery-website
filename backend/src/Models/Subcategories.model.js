const mongoose = require("mongoose");


const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 30
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category"
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

const SubCategoryModel = mongoose.model("subcategory", SubcategorySchema);

module.exports = SubCategoryModel;