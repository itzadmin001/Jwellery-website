const CartModel = require("../Models/Cart.mode");
const ProductModel = require("../Models/Product.model");

async function createCart(req, res) {
    try {
        const { product_id } = req.body;
        if (!product_id) {
            return res.status(400).json({ message: "product_id is required" });
        }
        for (let c of product_id) {
            const Dbcart = await CartModel.findOne({ user: req.user._id, product: c.pId })
            if (Dbcart) {
                await CartModel.updateOne({ _id: Dbcart._id }, { qty: Dbcart.qty + c.qty })
            } else {
                const newCart = new CartModel({
                    user: req.user._id,
                    product: c.pId,
                    qty: c.qty
                });
                await newCart.save()
            }
        }
        const FindCart = await CartModel.find({ user: req.user._id }).populate("product")
        return res.status(201).json({
            message: "Cart created successfully",
            data: FindCart
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

async function getCart(req, res) {

    try {
        const data = await CartModel.find({ user: req.user.id }).populate("product");
        return res.status(200).json({ message: "Cart fetched successfully", data });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
async function getAllCart(req, res) {
    try {
        const data = await CartModel.find().populate("product");
        return res.status(200).json({ message: "Cart fetched successfully", data });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
async function changeCartQty(req, res) {
    const { id, qty } = req.params
    try {
        if (qty == 0) {
            CartModel.deleteOne({ user: req.user._id, product: id })
                .then(
                    (success) => {
                        res.status(200).json({
                            msg: "data deleted"
                        })
                    }
                ).catch((error) => {
                    res.status(407).json({
                        msg: "Failed to update quantity"
                    })
                })
        } else {
            CartModel.updateOne({ user: req.user._id, product: id }, { qty: qty })
                .then(
                    (success) => {
                        res.status(201).json({
                            msg: "updated quantity"
                        })
                    }
                ).catch(
                    (error) => {
                        res.status(402).json({
                            status: 0,
                            msg: "Failed to update quantity"
                        })
                    }
                )
        }

    } catch (e) {
        console.log(e)
        rej({
            status: 0,
            msg: "Internal server error"
        })
    }
}
async function updateCart(req, res) {
    try {
        const { id } = req.params;
        const { qty } = req.body;

        if (!qty) {
            return res.status(400).json({ message: "Quantity is required" });
        }

        if (qty <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        const cart = await CartModel.findOne({ _id: id, user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = await ProductModel.findById(cart.product);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const unitPrice = product.discount_price || product.price || 0;
        const newTotal = unitPrice * qty;

        cart.qty = qty;
        cart.total = newTotal;
        await cart.save();

        return res.status(200).json({ message: "Cart updated successfully", data: cart });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteCart(req, res) {
    try {
        const { id } = req.query;

        if (id === undefined) {
            await CartModel.deleteMany({ user: req.user._id });
            return res.status(200).json({ message: "All cart items deleted successfully" });
        }

        const deleted = await CartModel.findOneAndDelete({ _id: id, user: req.user._id });
        if (!deleted) {
            return res.status(404).json({ message: "Cart not found" });
        }
        return res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createCart, changeCartQty, getCart, getAllCart, updateCart, deleteCart };


