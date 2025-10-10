const express = require("express");
const multer = require("multer");
const SubcategoryRouter = express.Router();
const { adminAuth, userAuth } = require("../Middlewares/User.auth");
const SubCategoryControllar = require("../Controllars/Subcategory.controllar");

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

SubcategoryRouter.post("/create",
    adminAuth,
    upload.single('image'),
    SubCategoryControllar.createsubCategory
);

// GET /api/categories/get - Get all categories or get category by ID (Public)
SubcategoryRouter.get("/get", SubCategoryControllar.getSubCategories);

// PUT /api/categories/update/:id - Update category (Admin only)
SubcategoryRouter.put("/update/:id",
    adminAuth,
    upload.single('image'),
    SubCategoryControllar.updateSubCategory
);

// PATCH /api/categories/update-status - Update category status (Admin only)
SubcategoryRouter.patch("/change-status/:id/:status", adminAuth, SubCategoryControllar.updateSubCategoryStatus);

// DELETE /api/categories/delete - Delete a category (Admin only)
SubcategoryRouter.delete("/delete/:id", adminAuth, SubCategoryControllar.deleteSubCategory
);

module.exports = SubcategoryRouter;
