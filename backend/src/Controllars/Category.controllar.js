const CategoryModel = require("../Models/Category.model");
const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");
const path = require("path");


// Create a new category
async function createCategory(req, res) {
    try {
        const { name, slug, image } = req.body;

        if (!name || !slug || !image) {
            return res.status(400).json({
                message: "Name image and slug are required fields"
            });
        }

        const existingCategory = await CategoryModel.findOne({ slug });
        if (existingCategory) {
            return res.status(409).json({
                message: "Category with this slug already exists"
            });
        }

        const created = await CategoryModel.create({
            name,
            slug,
            image
        });

        return res.status(201).json({
            message: "Category created successfully",
            data: created
        });
    } catch (error) {
        console.error("Category creation error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function getCategories(req, res) {
    try {
        const { id } = req.query;

        // If ID is provided, return specific category
        if (id !== undefined && id !== null && id !== '') {
            const category = await CategoryModel.findById(id);

            if (!category) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }

            return res.status(200).json({
                message: "Category fetched successfully",
                data: category
            });
        }

        // Return all categories with optional filtering
        const { limit } = req.query;
        let query = {};

        const categories = await CategoryModel.find(query)

        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error("Category fetch error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, slug, image } = req.body;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                message: "Category ID is required"
            });
        }

        // Find existing category
        const existingCategory = await CategoryModel.findById(id);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        let updateData = {};


        // Update other fields only if provided
        if (name !== undefined) updateData.name = name;
        if (image !== undefined) updateData.image = image;
        if (slug !== undefined) {
            const slugExists = await CategoryModel.findOne({
                slug,
                _id: { $ne: id }
            });
            if (slugExists) {
                return res.status(409).json({
                    message: "Category with this slug already exists"
                });
            }
            updateData.slug = slug;
        }



        // Perform update
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            { ...updateData },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error("Category update error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Update category status
async function updateCategoryStatus(req, res) {
    try {
        const { id, status } = req.params;

        if (!id || status === undefined) {
            return res.status(400).json({
                message: "ID and status are required"
            });
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category status updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        console.error("Category status update error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// Delete category
async function deleteCategory(req, res) {

    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Category ID is required"
            });
        }

        // Find category to get image URL for deletion
        const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        // Delete category from database
        await CategoryModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Category delete error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    updateCategoryStatus,
    deleteCategory
};
