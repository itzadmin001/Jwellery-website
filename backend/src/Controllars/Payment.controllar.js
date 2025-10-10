require('dotenv').config();
const Razorpay = require('razorpay');
const PaymentModel = require('../Models/Payment.model');
const OrderModel = require('../Models/Order.model');
const CartModel = require('../Models/Cart.mode');

const crypto = require('crypto');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function CreatePayment(req, res) {
    try {
        const { user_details, order_total, paymentMethod, product_detail, form } = req.body;

        if (!user_details || !product_detail || !order_total) {
            return res.status(400).json({
                message: "All fields are required: user, item, totalAmount, shippingAddress"
            });
        }

        if (order_total <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const order = new OrderModel({
            user: req.user._id,
            product_detail: product_detail,
            totalAmount: order_total,
            order_payment_type: paymentMethod,
            shippingAddress: form
        });

        await order.save();
        await CartModel.deleteMany({ user: req.user._id });

        if (paymentMethod === 1) {
            // success for COD/other method: use 201 (fix: earlier returned 400)
            return res.status(201).json({
                message: "Order created successfully",
                order_id: order._id,
            });
        } else {
            // prepare razorpay options
            const orderOptions = {
                order_total: Math.round(order_total * 100), // Razorpay expects amount in paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            };

            // create razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: orderOptions.order_total,
                currency: orderOptions.currency,
                receipt: orderOptions.receipt
            });

            // use defined amount variable (fix: previously 'amount' was undefined)
            const amount = orderOptions.order_total;

            // Create payment record
            const payment = await PaymentModel.create({
                user: req.user._id,
                order: order._id,
                razorpay_order_id: razorpayOrder.id,
                amount: {
                    amount: amount,
                    currency: "INR"
                },
                status: 'pending'
            });

            return res.status(201).json({
                message: "Payment order created successfully",
                data: {
                    ...payment.toObject(),
                    razorpay_order_id: razorpayOrder.id,
                    razorpay_key_id: process.env.RAZORPAY_KEY_ID,
                }
            });
        }
    } catch (error) {
        console.error("Payment creation error:", error);
        return res.status(500).json({ message: error.message });
    }
}


async function verifyPayment(req, res) {
    try {
        const { razorpayOrderId, razorpayPaymentId, signature } = req.body;

        // Validate required fields
        if (!razorpayOrderId || !razorpayPaymentId || !signature) {
            return res.status(400).json({
                message: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required"
            });
        }

        // Verify signature

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({
                message: "Invalid signature"
            });
        }

        // Find and update payment
        const payment = await PaymentModel.findOne({ razorpay_order_id: razorpayOrderId, status: "pending" });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        payment.razorpay_payment_id = razorpayPaymentId;
        payment.razorpay_signature = signature;
        payment.status = "completed";

        await payment.save();

        res.status(200).json({
            message: "Payment verified successfully",
            data: payment
        });


    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function GetAllPayments(req, res) {
    try {


        const FindPayment = await PaymentModel.find().populate(["user", "order"])

        if (!FindPayment) {
            res.status(404).json({
                message: "payment not found "
            })
        }

        res.status(200).json({
            message: "ALl transtion found ",
            FindPayment
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "INter server erorr "
        })
    }
}


async function DeletePayment(req, res) {

    try {

        const { id } = req.params


        if (!id) {
            return res.status(401).json({
                message: " Payment Id required"
            })
        }

        const FindPayments = await PaymentModel.findById(id);

        if (!FindPayments) {
            return res.status(404).json({
                message: "Transtions Not Found"
            })
        }

        await PaymentModel.findByIdAndDelete(id)

        res.status(200).json({
            message: "transtion Delete Successfully"
        })



    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    CreatePayment,
    DeletePayment,
    verifyPayment,
    GetAllPayments
};
