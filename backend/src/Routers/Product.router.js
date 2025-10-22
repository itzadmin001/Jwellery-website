const express = require("express");
const productRouter = express.Router();
const fileUpload = require("express-fileupload");

const { adminAuth, userAuth } = require("../Middlewares/User.auth");
const ProductControllar = require("../Controllars/Product.controllar");


const uploadOptions = {
    useTempFiles: true,
    tempFileDir: "/tmp/",
}




// POST /api/products/create - Create a new product (Admin only)
productRouter.post("/create", adminAuth, ProductControllar.createProduct);

productRouter.post("/add-product-excel", adminAuth, fileUpload(uploadOptions), ProductControllar.addProductExcel);

// GET /api/products/get - Get all products or get product by ID/slug/category (Public)
productRouter.get("/get", ProductControllar.getProducts);

productRouter.get("/get-all", adminAuth, ProductControllar.getAllProducts);

// PUT /api/products/update/:id - Update product (Admin only)
productRouter.put("/update/:id", adminAuth, ProductControllar.updateProduct);

// PATCH /api/products/update-status - Update product status (Admin only)
productRouter.patch("/update-status", adminAuth, ProductControllar.updateProductStatus);

// DELETE /api/products/delete - Delete a product (Admin only)
productRouter.delete("/delete/:id", adminAuth, ProductControllar.deleteProduct);

module.exports = productRouter;
