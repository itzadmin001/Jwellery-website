const express = require("express");
const { userAuth, adminAuth } = require("../Middlewares/User.auth");
const { createCart, getCart, updateCart, deleteCart, getAllCart, changeCartQty } = require("../Controllars/Cart.controllar");

const cartRouter = express.Router();

// Create cart item
cartRouter.post("/create", userAuth, createCart);

// Read: use query ?id= to fetch single, else all
cartRouter.get("/get", getCart);


cartRouter.get("/get-admin", adminAuth, getAllCart);


// Update qty and recalc total
cartRouter.get("/change-qty/:id/:qty", userAuth, changeCartQty)

cartRouter.patch("/update/:id", updateCart);

// Delete: all or specific via query ?id=
cartRouter.delete("/delete", deleteCart);

module.exports = cartRouter;


