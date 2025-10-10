const ProductModel = require("../Models/Product.model");
const CategoryModel = require("../Models/Category.model");
const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const SubCategoryModel = require("../Models/Subcategories.model");
const { default: mongoose } = require("mongoose");

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENGPOINT
});

async function createProduct(req, res) {
    try {
        const {
            name,
            slug,
            price,
            color,
            category,
            product_category,
            status,
            stock,
            sale
        } = req.body;

        console.log(product_category)
        // Validate required fields
        if (!name || !slug || !price || !category || !product_category) {
            return res.status(400).json({
                message: "Name, slug, price, and category are required"
            });
        }



        let imageUrl = null;
        let relatedImageUrl = [];


        if (req.files) {
            try {
                const fileExtension = path.extname(req.files.image[0].originalname);
                const uniqueFileName = `${uuidv4()}${fileExtension}`;
                const uploadResult = await imagekit.upload({
                    file: req.files.image[0].buffer,
                    fileName: uniqueFileName,
                    folder: "/product"
                });
                imageUrl = uploadResult.url;

                for (const file of req.files.relatedImage) {

                    try {
                        const fileExtension = path.extname(file.originalname);
                        const uniqueFileName = `${uuidv4()}${fileExtension}`;
                        const uploadResult = await imagekit.upload({
                            file: file.buffer,
                            fileName: uniqueFileName,
                            folder: "/product/relatedImage"
                        });
                        relatedImageUrl.push(uploadResult.url);

                    } catch (uploadError) {
                        console.error("ImageKit upload error:", uploadError);
                        return res.status(500).json({
                            message: "Failed to upload image",
                            error: uploadError.message
                        });
                    }
                }

            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload image",
                    error: uploadError.message
                });
            }
        }


        const created = await ProductModel.create({
            name,
            slug,
            image: imageUrl,
            price,
            relatedImage: relatedImageUrl,
            color,
            subcategory: product_category,
            category,
            status: status !== undefined ? status : true,
            stock: stock !== undefined ? stock : true,
            sale: sale !== undefined ? sale : false
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: created
        });
    } catch (error) {
        console.error("Product creation error:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function getProducts(req, res) {
    try {
        const query = req.query;
        const { id, product_category, category, limit, price } = query;

        let data = [];
        let newQuery = {}

        if (price !== undefined) {
            const maxPrice = Number(price);
            if (!isNaN(maxPrice)) {
                newQuery.price = { $lte: maxPrice };
            }
        }

        if (id && id !== undefined) {

            data = await ProductModel.findById(id).populate(["category", "subcategory"]);

        } else {
            const byCategory = await SubCategoryModel.findOne({ slug: product_category })
            if (byCategory != undefined) {
                newQuery.subcategory = byCategory._id

                data = await ProductModel.find(newQuery).populate(["category", "subcategory"]).limit(parseInt(limit));

            } else {
                const byparantCategory = await CategoryModel.findOne({ _id: category })
                if (byparantCategory != undefined) {
                    newQuery.category = byparantCategory._id
                    data = await ProductModel.find(newQuery).populate(["category", "subcategory"]).limit(parseInt(limit))
                    return res.status(200).json({
                        message: "Product fetched successfully",
                        data
                    });
                } else {
                    data = await ProductModel.find(newQuery)
                        .populate(["category", "subcategory"])
                        .limit(parseInt(limit));

                }
            }

        }
        return res.status(200).json({
            message: "Product fetched successfully",
            data
        });
    } catch (error) {
        console.error("Product fetch error:", error);
        if (error.name === 'CastError') {
            return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(500).json({ message: error.message });
    }
}
async function getAllProducts(req, res) {
    try {
        const FindAllProduct = await ProductModel.find();
        if (FindAllProduct) {
            res.status(200).json({
                message: "all product fetch ",
                FindAllProduct
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "internal server error"
        })
    }
}
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            name,
            slug,
            price,
            color,
            category,
            product_category,
            status,
            stock,
            sale
        } = req.body;

        // Check if product exists
        const existingProduct = await ProductModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if slug is being updated and if it conflicts with another product
        if (slug && slug !== existingProduct.slug) {
            const slugExists = await ProductModel.findOne({ slug, _id: { $ne: id } });
            if (slugExists) {
                return res.status(409).json({
                    message: "Product with this slug already exists"
                });
            }
        }

        let updateData = {};

        // Only update fields that are provided
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (price !== undefined) updateData.price = price;
        if (color !== undefined) updateData.color = color;
        if (category !== undefined) updateData.category = category;
        if (product_category !== undefined) updateData.subcategory = product_category;
        if (status !== undefined) updateData.status = status;
        if (stock !== undefined) updateData.stock = stock;
        if (sale !== undefined) updateData.sale = sale;

        // Handle image update if file is provided
        if (req.file) {
            try {
                const fileExtension = path.extname(req.file.originalname);
                const uniqueFileName = `${uuidv4()}${fileExtension}`;

                const uploadResult = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: uniqueFileName,
                    folder: "/product"
                });
                updateData.image = uploadResult.url;
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload image",
                    error: uploadError.message
                });
            }
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate(["category", "subcategory"]);

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Product update error:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function updateProductStatus(req, res) {
    try {
        const { id, field, new_status } = req.query;

        // required params check
        if (!id || !field || typeof new_status === 'undefined') {
            return res.status(400).json({ message: "id, field and new_status are required" });
        }

        // validate id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        // whitelist allowed fields to update
        const ALLOWED_FIELDS = new Set(['featured', 'status', 'stock', 'sale']);

        if (!ALLOWED_FIELDS.has(field)) {
            return res.status(400).json({ message: `Field '${field}' is not allowed to update` });
        }

        // convert new_status to boolean (accepts 'true'/'false', true/false, '1'/'0')
        const toBoolean = (val) => {
            if (val === true || val === 'true' || val === '1' || val === 1) return true;
            if (val === false || val === 'false' || val === '0' || val === 0) return false;
            // fallback: JSON.parse may throw, so try a strict check
            return Boolean(val);
        };

        const boolValue = toBoolean(new_status);

        // build dynamic update
        const updateObj = { [field]: boolValue };

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: updateObj },
            { new: true }
        ).populate(["category", "subcategory"]);

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product field updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Product status update error:", error);
        // CastError usually indicates invalid ObjectId or type issues
        if (error.name === 'CastError') {
            return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(500).json({ message: error.message || "Server error" });
    }
}


async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete image from ImageKit if URL exists
        if (product.image) {
            try {
                // Extract filePath from URL relative to urlEndpoint
                const urlEndpoint = process.env.IMAGEKIT_URL_ENGPOINT;
                const relativePath = product.image.replace(urlEndpoint, "");

                // ImageKit requires fileId to delete; if fileId isn't stored, use list & delete by path
                const list = await imagekit.listFiles({ path: relativePath.startsWith("/") ? path.posix.dirname(relativePath) : relativePath });
                const target = list.find(f => f.url === product.image || ("/" + f.filePath) === relativePath || f.filePath === relativePath);
                if (target && target.fileId) {
                    await imagekit.deleteFile(target.fileId);
                }
            } catch (ikErr) {
                console.error("ImageKit delete error:", ikErr);
                // proceed to delete DB even if image deletion fails
            }
        }

        await ProductModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Product delete error:", error);
        if (error.name === 'CastError') {
            return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createProduct, getAllProducts, getProducts, updateProduct, updateProductStatus, deleteProduct };


