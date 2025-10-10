import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../ContextMain";
import axios from "axios";



function MyOrders() {
    const { OrderBaseUrl, BACKEND_URL } = useContext(MainContext)
    const [MyOrder, SetMyOrders] = useState([])



    useEffect(() => {

        axios.get(BACKEND_URL + OrderBaseUrl + "/get", {
            withCredentials: true
        }).then((success) => {
            console.log(success)
            SetMyOrders(success.data.data)
        }).catch((err) => {
            console.log(err)
            SetMyOrders([])

        })


    }, [])









    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

            {MyOrder && MyOrder.length > 0 ? (
                MyOrder.map((order, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-6 mb-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">
                                    Order Status:{" "}
                                    <span
                                        className={`capitalize ${order.status === "pending"
                                            ? "text-yellow-500"
                                            : order.status === "completed"
                                                ? "text-green-500"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mt-2 md:mt-0">
                                Total: ₹{order.totalAmount}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {order.product_detail.map((product, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover rounded-md mb-3"
                                    />
                                    <h3 className="font-semibold text-gray-700">{product.name}</h3>
                                    <p className="text-gray-500">Quantity: {product.qty}</p>
                                    <p className="font-semibold text-gray-800 mt-1">₹{product.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 border-t pt-4 text-gray-700">
                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                            <p>
                                City: {order.shippingAddress.city}, State: {order.shippingAddress.state}
                            </p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                            <p>
                                Payment Type:{" "}
                                {order.order_payment_type === 1 ? "Cash on Delivery" : "Online"}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 mt-20 text-xl font-medium">
                    No orders found
                </div>
            )}
        </div>
    );
}

export default MyOrders;
