const ProductModel = require("../Models/Product.model");
const CategoryModel = require("../Models/Category.model");
const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { default: mongoose } = require("mongoose");
const Product = require("../Models/Product.model");
const { XlsxTojson } = require("../Utils/xlsx");


function isValidUrl(url) {
    if (!url || typeof url !== "string") return false;
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

async function createProduct(req, res) {
    // Clean, robust createProduct implementation
    try {
        const body = req.body || {};

        // small helpers
        const toArray = (val) => {
            if (!val && val !== 0) return [];
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return [val];
        };

        const toNumber = (v, fallback = undefined) => {
            if (v === undefined || v === null || v === '') return fallback;
            const n = Number(v);
            return Number.isNaN(n) ? fallback : n;
        };

        const toBoolean = (v, fallback = false) => {
            if (v === undefined || v === null) return fallback;
            if (typeof v === 'boolean') return v;
            if (typeof v === 'string') return ['true', '1', 'yes'].includes(v.toLowerCase());
            return Boolean(v);
        };

        const {
            name,
            slug,
            description = '',
            price,
            originalPrice,
            category, // expect category name (e.g., 'Earrings')
            collection = '',
            material = '',
            weight = '',
            dimensions = '',
            sku,
            stockQuantity = 0,
            features = [],
            image,
            relatedImage = [],
            certifications = [],
            tags = [],
            metaTitle = '',
            metaDescription = '',
            featured = false,
            status = true
        } = body;

        // basic validation
        const errors = [];
        if (!name) errors.push('name is required');
        if (!slug) errors.push('slug is required');
        if (price === undefined || price === null || price === '') errors.push('price is required');
        if (!category) errors.push('category is required');
        if (!sku) errors.push('sku is required');
        if (!image) errors.push('image is required');
        if (errors.length) return res.status(400).json({ message: 'validation failed', errors });

        // verify image url optionally
        if (!isValidUrl(image)) return res.status(400).json({ message: 'invalid image url' });

        // check unique sku
        const existingSku = await ProductModel.findOne({ sku: String(sku).trim() });
        if (existingSku) return res.status(409).json({ message: 'SKU already exists' });

        // Resolve or create category: match by slug case-insensitive
        const categorySlug = String(category).trim().toLowerCase().replace(/\s+/g, '-');
        let categoryDoc = await CategoryModel.findOne({ slug: categorySlug });
        if (!categoryDoc) {
            // create category with given name -> slug
            categoryDoc = await CategoryModel.create({ name: String(category).trim(), slug: categorySlug });
        }

        // Prepare product data
        const productData = {
            name: String(name).trim(),
            slug: String(slug).trim(),
            description: String(description || ''),
            price: toNumber(price),
            originalPrice: toNumber(originalPrice, undefined),
            category: categoryDoc._id,
            collection: String(collection || ''),
            material: String(material || ''),
            weight: String(weight || ''),
            dimensions: String(dimensions || ''),
            sku: String(sku).trim(),
            stockQuantity: toNumber(stockQuantity, 0),
            features: toArray(features),
            image: String(image).trim(),
            relatedImage: toArray(relatedImage),
            certifications: toArray(certifications),
            tags: toArray(tags),
            metaTitle: String(metaTitle || ''),
            metaDescription: String(metaDescription || ''),
            featured: toBoolean(featured, false),
        };

        const created = await ProductModel.create(productData);
        const populated = await ProductModel.findById(created._id).populate('category');

        return res.status(201).json({ message: 'Product created successfully', data: populated });
    } catch (error) {
        console.error('Product creation error:', error);
        return res.status(500).json({ message: 'internal server error', error: error.message });
    }
}

async function addProductExcel(req, res) {
    try {
        // XlsxTojson khud response send kar dega, yaha return ki zarurat nahi
        await XlsxTojson(req, res);
    } catch (err) {
        console.error('Excel import error:', err);
        // Agar response already send nahi hua toh error send karo
        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            });
        }
    }
}

async function getProducts(req, res) {
    try {
        const query = req.query;
        const { id, category, limit, price } = query;


        let data = [];
        let newQuery = {}

        if (price !== undefined) {
            const maxPrice = Number(price);
            if (!isNaN(maxPrice)) {
                newQuery.price = { $lte: maxPrice };
            }
        }

        if (id && id !== undefined) {
            // populate should reference the schema field name 'category' (lowercase)
            data = await ProductModel.findById(id).populate("category");
        } else {
            const Category = await CategoryModel.findOne({ slug: category })
            if (Category != undefined) {
                newQuery.category = Category._id
                data = await ProductModel.find(newQuery).populate("category").limit(parseInt(limit))
                return res.status(200).json({
                    message: "Product fetched successfully",
                    data
                });
            } else {
                data = await ProductModel.find(newQuery).populate("category").limit(parseInt(limit))
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

        const { categoryId } = req.query;

        if (categoryId) {
            const FindAllProduct = await ProductModel.find({ category: categoryId }).populate("category");
            if (FindAllProduct) {
                return res.status(200).json({
                    message: "product fetch by category",
                    FindAllProduct
                })
            }
        }

        const FindAllProduct = await ProductModel.find().populate("category");
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
            description,
            price,
            originalPrice,
            category,
            collection,
            material,
            weight,
            dimensions,
            sku,
            inStock,
            stockQuantity,
            features,
            image,
            relatedImage,
            certifications,
            tags,
            metaTitle,
            metaDescription,
            featured,
            status
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

        // Check if SKU is being updated and if it conflicts with another product
        if (sku && sku !== existingProduct.sku) {
            const skuExists = await ProductModel.findOne({ sku, _id: { $ne: id } });
            if (skuExists) {
                return res.status(409).json({
                    message: "Product with this SKU already exists"
                });
            }
        }

        let updateData = {};

        // Only update fields that are provided
        if (name !== undefined) updateData.name = name;
        if (slug !== undefined) updateData.slug = slug;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
        if (category !== undefined) updateData.category = category;
        if (collection !== undefined) updateData.collection = collection;
        if (material !== undefined) updateData.material = material;
        if (weight !== undefined) updateData.weight = weight;
        if (dimensions !== undefined) updateData.dimensions = dimensions;
        if (sku !== undefined) updateData.sku = sku;
        if (inStock !== undefined) updateData.inStock = Boolean(inStock);
        if (stockQuantity !== undefined) updateData.stockQuantity = Number(stockQuantity);
        if (features !== undefined) {
            updateData.features = Array.isArray(features) ? features : (typeof features === "string" ? features.split(",").map(s => s.trim()) : []);
        }
        if (image !== undefined) updateData.image = image;
        if (relatedImage !== undefined) {
            if (Array.isArray(relatedImage)) {
                updateData.relatedImage = relatedImage;
            } else if (typeof relatedImage === "string" && relatedImage.trim() !== "") {
                updateData.relatedImage = relatedImage.split(",").map(s => s.trim()).filter(s => s);
            } else {
                updateData.relatedImage = [];
            }
        }
        if (certifications !== undefined) {
            updateData.certifications = Array.isArray(certifications) ? certifications : (typeof certifications === "string" ? certifications.split(",").map(s => s.trim()) : []);
        }
        if (tags !== undefined) {
            updateData.tags = Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map(s => s.trim()) : []);
        }
        if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
        if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
        if (featured !== undefined) updateData.featured = Boolean(featured);
        if (status !== undefined) updateData.status = Boolean(status);

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate("category");

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

        // whitelist allowed fields to update - only status, featured, and inStock
        const ALLOWED_FIELDS = new Set(['status', 'featured', 'inStock']);

        if (!ALLOWED_FIELDS.has(field)) {
            return res.status(400).json({ message: `Field '${field}' is not allowed to update. Only 'status', 'featured', and 'inStock' are allowed.` });
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
        ).populate("category");

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

module.exports = { createProduct, addProductExcel, getAllProducts, getProducts, updateProduct, updateProductStatus, deleteProduct };


