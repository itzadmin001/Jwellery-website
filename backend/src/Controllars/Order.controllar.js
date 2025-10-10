const CartModel = require("../Models/Cart.mode");
const OrderModel = require("../Models/Order.model");
const PaymentModel = require("../Models/Payment.model");

// Create a new order
const createOrder = async (req, res) => {

    try {


        // Create new order
        const newOrder = new OrderModel({
            user,
            item,
            totalAmount,
            shippingAddress
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            data: savedOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Read orders - if id is undefined return all orders, if id is found return particular order
const readOrder = async (req, res) => {

    try {
        const { id } = req.query;
        const isAdmin = req.user.role === 'admin';

        let query = {};


        if (!isAdmin) {
            // If not admin, only fetch orders for this user
            query.user = req.user._id;
        }

        if (id) {
            // If an order ID is provided, fetch that specific order
            query._id = id;
        }

        const orders = await OrderModel.find(query).populate(["user  product_detail"])

            .sort({ createdAt: -1 });


        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: id ? "Order not found" : "No orders found"
            });
        }

        res.status(200).json({
            message: id ? "Order fetched successfully" : "Orders fetched successfully",
            data: id ? orders[0] : orders
        });

    } catch (error) {
        console.error("Error reading order:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id, new_status } = req.query;

        // Validate id and status
        if (!id || !new_status) {
            return res.status(400).json({
                message: "ID and new_status are required"
            });
        }

        // Validate status
        const validStatuses = ["pending", "confirmed", "cancelled", "shipped", "delivered"];
        if (!validStatuses.includes(new_status)) {
            return res.status(400).json({
                message: `Status must be one of: ${validStatuses.join(", ")}`
            });
        }

        // Find and update the order
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            { status: new_status },
            { new: true, runValidators: true }
        ).populate('user', 'product_detail')

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Order ID is required"
            });
        }


        const FindLinkId = await PaymentModel.findOne({ order: id })

        if (FindLinkId) {
            return res.status(400).json({
                success: false,
                message: "❌ Order cannot be deleted because it is linked to existing Payments.",
            });
        }

        const deletedOrder = await OrderModel.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    readOrder,
    updateOrderStatus,
    deleteOrder
};
