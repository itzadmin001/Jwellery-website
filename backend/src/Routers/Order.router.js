const express = require("express");
const { createOrder, readOrder, updateOrderStatus, deleteOrder } = require("../Controllars/Order.controllar");
const { userAuth, adminAuth } = require("../Middlewares/User.auth");

const router = express.Router();

// POST /api/orders/create - Create a new order
router.post("/create", userAuth, createOrder);

// GET /api/orders/get - Get all orders or specific order by ID
router.get("/get", userAuth, readOrder);

router.get("/admin/get", adminAuth, readOrder);
// PATCH /api/orders/update-status - Update order status (Admin only)
router.patch("/update-status", adminAuth, updateOrderStatus);

// DELETE /api/orders/delete - Delete order (Admin only)
router.delete("/delete/:id", adminAuth, deleteOrder);

module.exports = router;
