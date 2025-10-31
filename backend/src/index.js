const express = require("express");
const userRouter = require("./Routers/User.router");
const cors = require("cors");
const categoryRouter = require("./Routers/Category.router");
const cartRouter = require("./Routers/Cart.router");
const productRouter = require("./Routers/Product.router");
const orderRouter = require("./Routers/Order.router");
const PaymentRouter = require("./Routers/Payment.router");
const WishListRouter = require("./Routers/WishList.router");

const app = express()

const FRONTEND_URL = process.env.FRONTEND_BASE_URL || "http://localhost:3000";





app.use(cors({
    origin: [FRONTEND_URL],

    credentials: true,
}));

app.use(express.json());

app.use(express.static("public", { maxAge: "1y", etag: false }));

// User Api Routes
app.use("/auth", userRouter);



// Category Api Routes
app.use("/category", categoryRouter);


// Cart Api Routes
app.use("/cart", cartRouter);

// Product Api Routes
app.use("/products", productRouter);

// Order Api Routes
app.use("/orders", orderRouter);

// Payment Create

app.use("/payment", PaymentRouter)


app.use("/wishlist", WishListRouter)


module.exports = app
