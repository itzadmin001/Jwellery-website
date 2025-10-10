const express = require("express");
const UserControllar = require("../Controllars/User.controllar");
const { registerUserValidator, loginUserValidator, userAddressValidator } = require("../Middlewares/User.velidator");
const { userAuth, adminAuth } = require("../Middlewares/User.auth");

const userRouter = express.Router();



userRouter.post("/register", registerUserValidator, UserControllar.registerUser);


userRouter.post("/login", loginUserValidator, UserControllar.loginUser);


userRouter.post("/find-all", adminAuth, UserControllar.getAllusers);

userRouter.get("/me", userAuth, UserControllar.getUser);


userRouter.get("/logout", UserControllar.logout);

userRouter.get("/address", userAuth, UserControllar.GetuserAddress);

userRouter.post("/address", userAuth, userAddressValidator, UserControllar.AdduserAddress);

userRouter.delete("/address/:id", userAuth, UserControllar.DeleteuserAddress);

// admin Router
userRouter.post("/admin/me", UserControllar.loginUser)
module.exports = userRouter;