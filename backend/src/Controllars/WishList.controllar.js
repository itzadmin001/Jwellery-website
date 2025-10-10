const Product = require("../Models/Product.model");
const User = require("../Models/User.model");
const WishListModel = require("../Models/Wishlist.model");




async function createWishlist(req, res) {
    try {
        const { productIds } = req.body; // array of product IDs
        const userId = req.user._id;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                message: "Product IDs array is required"
            });
        }

        const [FindUser, Products] = await Promise.all([
            User.findById(userId),
            Product.find({ _id: { $in: productIds } })
        ]);

        if (!FindUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!Products.length) {
            return res.status(404).json({ message: "No valid products found" });
        }

        // Check if user already has wishlist, else create new
        let wishlist = await WishListModel.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new WishListModel({
                user: userId,
                product: productIds
            });
        } else {
            // merge unique IDs only
            const existingIds = new Set(wishlist.product.map(p => p.toString()));
            productIds.forEach(id => existingIds.add(id));
            wishlist.product = Array.from(existingIds);
        }

        await wishlist.save();

        res.status(200).json({
            message: "Products added to wishlist successfully",
            wishlist
        });

    } catch (err) {
        console.error("createWishlist error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function removeOne(req, res) {
    try {
        const { id } = req.query;
        const userId = req.user._id;
        const result = await WishListModel.updateOne(
            { user: userId },
            { $pull: { product: id } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        const Response = await WishListModel.findOne({ user: userId }).populate("product")
        return res.status(200).json({
            message: "Product removed from wishlist successfully",
            Response
        });

    } catch (err) {
        console.error("removeOne error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

async function getAllWishlist(req, res) {
    try {
        const userId = req.user._id;

        const result = await WishListModel.findOne({ user: userId }).populate("product");

        if (!result) {
            return res.status(404).json({
                message: " Product Not Found"
            })
        }
        res.status(200).json({
            message: "Product Found Successfully",
            result
        })








    } catch (err) {
        console.log(err)
    }
}



module.exports = {
    createWishlist,
    removeOne,
    getAllWishlist
}