const express = require("express")
const { userAuth } = require("../Middlewares/User.auth")
const WishListControllar = require("../Controllars/WishList.controllar")

const WishListRouter = express.Router()


WishListRouter.post("/create", userAuth, WishListControllar.createWishlist);
WishListRouter.get("/remove-wishlist", userAuth, WishListControllar.removeOne)
WishListRouter.get("/get", userAuth, WishListControllar.getAllWishlist)


module.exports = WishListRouter;