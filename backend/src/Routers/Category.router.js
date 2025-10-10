const express = require("express");
const multer = require("multer");
const categoryRouter = express.Router();
const { adminAuth, userAuth } = require("../Middlewares/User.auth");
const CategoryControllar = require("../Controllars/Category.controllar");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});



// Routes

categoryRouter.post("/create",
    adminAuth,
    upload.single('image'),
    CategoryControllar.createCategory
);

// GET /api/categories/get - Get all categories or get category by ID (Public)
categoryRouter.get("/get", CategoryControllar.getCategories);

// PUT /api/categories/update/:id - Update category (Admin only)
categoryRouter.put("/update/:id",
    adminAuth,
    upload.single('image'),
    CategoryControllar.updateCategory
);

// PATCH /api/categories/update-status - Update category status (Admin only)
categoryRouter.patch("/change-status/:id/:status", adminAuth, CategoryControllar.updateCategoryStatus);

// DELETE /api/categories/delete - Delete a category (Admin only)
categoryRouter.delete("/delete/:id", adminAuth, CategoryControllar.deleteCategory);

module.exports = categoryRouter;
