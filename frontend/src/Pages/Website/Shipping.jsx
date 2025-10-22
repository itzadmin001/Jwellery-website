import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../ContextMain";
import axios from "axios";
import { empptyCart } from "../../Reducers/CartSlice";
import useRazorpay from "react-razorpay";
import Razorpay from "react-razorpay/dist/razorpay";
import LoadingButton from "../../Components/Admin/LoadingButton"

function Shipping() {
    const [showPopup, setShowPopup] = useState(false);
    const { Productdata, BACKEND_URL, PaymentbaseUrl, notify } = useContext(MainContext)
    const cart = useSelector(state => state.cart)
    const [loading, Setloading] = useState(false)

    const user = useSelector(state => state.user.data)
    // Example products (replace with your data)




    useEffect(() => {
        if (!user) {
            navigate("/login")
        }

    }, [])

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
        email: "",
    });
    const [paymentMethod, SetPaymentMethod] = useState(2)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };



    const handleOrder = (e) => {
        Setloading(true)
        e.preventDefault();
        const product_detail = []

        for (const p of Productdata) {
            const Found = cart.data.find(i => i.pId === p._id)
            if (Found) {
                product_detail.push({
                    price: p.price,
                    name: p.name,
                    slug: p.slug,
                    image: p.image,
                    ...Found
                })
            }
        }

        for (const key in form) {
            if (!form[key] || form[key].trim() === "") {
                alert(`Please fill the ${key} field`);
                Setloading(false)
                return; // Stop execution if any field is empty
            }
        }

        const data = {
            user_details: form,
            product_detail,
            order_total: cart.total,
            paymentMethod,
            form
        }

        axios.post(BACKEND_URL + PaymentbaseUrl + "/create", data, {
            withCredentials: true
        }).then((success) => {
            if (paymentMethod === 1) {
                setShowPopup(true)
                setTimeout(() => setShowPopup(false), 500);
                dispatch(empptyCart())
                Setloading(false)
            } else {
                RazorpayPaymentPopUp(success.data.data.razorpay_order_id, success.data.data)

            }
            Setloading(false)
        }).catch((err) => {
            console.log(err)
        })

    };




    const RazorpayPaymentPopUp = (razorpayOrderId, RozarpayOrder) => {
        const options = {
            key: RozarpayOrder.razorpay_key_id, // Enter the Key ID generated from the Dashboard
            amount: RozarpayOrder.amount.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Deen Deyan Jewellery store",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
            handler: function (response) {
                axios.post(BACKEND_URL + PaymentbaseUrl + "/razorpay-payment-verify", {
                    razorpayOrderId: razorpayOrderId,
                    razorpayPaymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                })
                    .then(
                        (success) => {
                            notify(success.data.message, "success")
                            dispatch(empptyCart())
                            setShowPopup(true)
                            setTimeout(() => {
                                setShowPopup(false)
                                navigate("/")
                            }, 800);
                        }
                    ).catch(
                        (error) => {
                            console.log("error", error);
                        }
                    )
                //   alert(response.razorpay_payment_id);
                //   alert(response.razorpay_order_id);
                //   alert(response.razorpay_signature);
            },
            prefill: {
                name: user.name,
                email: user.email,
                contact: user.contact,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on('payment.failed', function (response) {
            alert('Payment Failed');
            alert('Error Code: ' + response.error.code);
            alert('Description: ' + response.error.description);
            alert('Source: ' + response.error.source);
            alert('Step: ' + response.error.step);
            alert('Reason: ' + response.error.reason);
            alert('Order ID: ' + response.error.metadata.order_id);
            alert('Payment ID: ' + response.error.metadata.payment_id);
        });

        rzp1.open();
    }





    const ShippingItem = []


    for (const p of Productdata) {
        const Found = cart.data?.find(i => i.pId === p._id)
        if (Found) {
            ShippingItem.push(
                <div key={p._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                        <img
                            src={p.image}
                            alt={p.name}
                            className="h-26 w-26 rounded-md border object-cover"
                        />
                        <div>
                            <div className="font-medium text-sm">{p.name}</div>
                            <div className="text-xs text-gray-500">Qty: {Found.qty}</div>
                        </div>
                    </div>
                    <div className="font-medium">₹{p.price}</div>
                </div>
            )
        }
    }



    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Form */}
                <section className="lg:col-span-7 bg-white  rounded-sm p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-6">Billing Details</h2>
                    <form onSubmit={handleOrder}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                        </div>

                        <input
                            type="text"
                            name="address"
                            placeholder="Street Address"
                            value={form.address}
                            onChange={handleChange}
                            className="border p-2 rounded w-full mt-4"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={form.state}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="pin"
                                placeholder="PIN Code"
                                value={form.pin}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="border p-2 rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    checked={paymentMethod === 1}
                                    onClick={() => SetPaymentMethod(1)}
                                />
                                Cash on Delivery
                            </label>
                            <label className="flex items-center gap-2 mt-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    checked={paymentMethod === 2}
                                    onClick={() => SetPaymentMethod(2)}
                                />
                                Online Payment
                            </label>
                        </div>

                        <LoadingButton name={"Place Order"} loading={loading} Setloading={Setloading}>

                        </LoadingButton>

                    </form>
                </section>

                {/* Right: Product Summary */}
                <aside className="lg:col-span-5 bg-white  rounded-sm p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Your Order</h3>
                    <div className="divide-y">
                        {ShippingItem}
                    </div>

                    <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>₹{cart?.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold mt-3">
                            <span>Total</span>
                            <span>₹{cart?.total.toFixed(2)}</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg text-center shadow-lg">
                        <h3 className="text-xl font-semibold">Thank you for your order!</h3>
                        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shipping;
