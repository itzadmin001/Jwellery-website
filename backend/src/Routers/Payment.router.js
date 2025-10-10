const express = require("express");
const PaymentControllar = require("../Controllars/Payment.controllar");
const { userAuth, adminAuth } = require("../Middlewares/User.auth");

const PaymentRouter = express.Router()



PaymentRouter.post("/create", userAuth, PaymentControllar.CreatePayment);


PaymentRouter.post("/razorpay-payment-verify", PaymentControllar.verifyPayment)


PaymentRouter.get("/get", adminAuth, PaymentControllar.GetAllPayments)


PaymentRouter.delete("/delete/:id", adminAuth, PaymentControllar.DeletePayment)



module.exports = PaymentRouter