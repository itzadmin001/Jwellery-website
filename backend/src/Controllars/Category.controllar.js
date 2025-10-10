const CategoryModel = require("../Models/Category.model");
const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const SubCategoryModel = require("../Models/Subcategories.model");

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENGPOINT
});

// Create a new category
async function createCategory(req, res) {
    try {
        const { name, slug, } = req.body;
        let imageUrl = null;

        // Validate required fields
        if (!name || !slug) {
            return res.status(400).json({
                message: "Name and slug are required fields"
            });
        }


        // Handle image upload if file is provided
        if (req.file) {
            try {
                const fileExtension = path.extname(req.file.originalname);
                const uniqueFileName = `${uuidv4()}${fileExtension}`;

                const uploadResult = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: uniqueFileName,
                    folder: "/category"
                });
                imageUrl = uploadResult.url;
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload image",
                    error: uploadError.message
                });
            }
        }

        // Check if category with same slug already exists
        const existingCategory = await CategoryModel.findOne({ slug });
        if (existingCategory) {
            return res.status(409).json({
                message: "Category with this slug already exists"
            });
        }

        // Create new category
        const created = await CategoryModel.create({
            name,
            slug,
            image: imageUrl,
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

// Get categories - all categories or specific category by ID
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
        const { name, slug } = req.body;

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

        // Handle image update if file is provided
        if (req.file) {
            try {
                const fileExtension = path.extname(req.file.originalname);
                const uniqueFileName = `${uuidv4()}${fileExtension}`;

                const uploadResult = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: uniqueFileName,
                    folder: "/category"
                });
                updateData.image = uploadResult.url;

                // Optional: Delete old image from ImageKit
                if (existingCategory.image) {
                    try {
                        const urlEndpoint = process.env.IMAGEKIT_URL_ENGPOINT;
                        const relativePath = existingCategory.image.replace(urlEndpoint, "");

                        const list = await imagekit.listFiles({
                            path: relativePath.startsWith("/") ? path.posix.dirname(relativePath) : relativePath
                        });
                        const target = list.find(f =>
                            f.url === existingCategory.image ||
                            ("/" + f.filePath) === relativePath ||
                            f.filePath === relativePath
                        );

                        if (target && target.fileId) {
                            await imagekit.deleteFile(target.fileId);
                        }
                    } catch (deleteError) {
                        console.error("Old image deletion error:", deleteError);
                        // Continue with update even if old image deletion fails
                    }
                }
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload new image",
                    error: uploadError.message
                });
            }
        }

        // Update other fields only if provided
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) {
            // Check if new slug conflicts with existing categories (excluding current one)
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

        const FindLinkCategory = await SubCategoryModel.findOne({ category: id })
        if (FindLinkCategory) {
            return res.status(409).json({
                success: false,
                message: "Category is linked with a subcategory, cannot delete."
            });
        }
        // Delete image from ImageKit if exists
        if (category.image) {
            try {
                const urlEndpoint = process.env.IMAGEKIT_URL_ENGPOINT;
                const relativePath = category.image.replace(urlEndpoint, "");

                const list = await imagekit.listFiles({
                    path: relativePath.startsWith("/") ? path.posix.dirname(relativePath) : relativePath
                });
                const target = list.find(f =>
                    f.url === category.image ||
                    ("/" + f.filePath) === relativePath ||
                    f.filePath === relativePath
                );

                if (target && target.fileId) {
                    await imagekit.deleteFile(target.fileId);
                }
            } catch (deleteError) {
                console.error("Image deletion error:", deleteError);
                // Continue with category deletion even if image deletion fails
            }
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
