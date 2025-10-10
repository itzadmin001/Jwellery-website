const express = require("express");
const multer = require("multer");
const productRouter = express.Router();
const { adminAuth, userAuth } = require("../Middlewares/User.auth");
const ProductControllar = require("../Controllars/Product.controllar");


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 10MB limit
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



// POST /api/products/create - Create a new product (Admin only)
productRouter.post("/create", adminAuth, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "relatedImage", maxCount: 5 }
]), ProductControllar.createProduct);

// GET /api/products/get - Get all products or get product by ID/slug/category (Public)
productRouter.get("/get", ProductControllar.getProducts);

productRouter.get("/get-all", adminAuth, ProductControllar.getAllProducts);

// PUT /api/products/update/:id - Update product (Admin only)
productRouter.put("/update/:id", adminAuth, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "relatedImage", maxCount: 5 }
]), ProductControllar.updateProduct);

// PATCH /api/products/update-status - Update product status (Admin only)
productRouter.patch("/update-status", adminAuth, ProductControllar.updateProductStatus);

// DELETE /api/products/delete - Delete a product (Admin only)
productRouter.delete("/delete/:id", adminAuth, ProductControllar.deleteProduct);

module.exports = productRouter;
