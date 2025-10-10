import React, { useContext, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux';
import { Changeqty } from '../../Reducers/CartSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MainContext } from '../../ContextMain';

function Cart({ cartOpen, setCartOpen }) {
    const cart = useSelector(state => state.cart)
    const user = useSelector(state => state.user.data)
    const { Productdata, CartBaseUrl, BACKEND_URL, notify } = useContext(MainContext)
    const navigate = useNavigate()
    const dispatch = useDispatch()




    const checkOutHandler = (e) => {
        setCartOpen()
        e.preventDefault()
        if (user == null) {
            navigate("/login?ref=checkout")
        } else {
            navigate("/checkout")

        }
    }


    const DbcartUpdate = (id, qty) => {
        if (user != null) {
            axios.get(BACKEND_URL + CartBaseUrl + "/change-qty" + "/" + id + "/" + qty, {
                withCredentials: true
            })
                .then(
                    (success) => {
                    }
                ).catch((err) => {
                    console.log(err)
                })
        }

    }
    const cartProducts = []


    for (const p of Productdata) {
        const Found = cart.data?.find(i => i.pId === p._id)
        if (Found) {
            cartProducts.push(
                <div
                    key={p._id}
                    className="flex items-center gap-4 border-b pb-4 last:border-none   "
                >
                    {/* Product Image */}
                    <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                        <p className="text-xs text-gray-500">₹{p.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            className="w-4 cursor-pointer  h-4 flex items-center justify-center border  hover:bg-gray-100 transition"
                            onClick={() => {
                                dispatch(Changeqty({
                                    pId: p._id,
                                    price: p.price,
                                    flag: 0
                                }))
                                DbcartUpdate(p._id, Found.qty - 1)
                            }}>
                            -
                        </button>
                        <input
                            type="number"
                            value={Found.qty}
                            readOnly
                            className="w-8 text-center rounded-lg text-black border "
                        />
                        <button
                            className="w-4 cursor-pointer h-4 flex items-center justify-center border hover:bg-gray-100 transition"

                            onClick={() => {
                                dispatch(Changeqty({ pId: p._id, price: p.price, flag: 1 }))
                                DbcartUpdate(p._id, Found.qty + 1)
                            }

                            }>
                            +
                        </button>
                    </div>
                </div>
            )
        }
    }



    return (
        <div
            className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${cartOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setCartOpen(false)}
            ></div>

            <div
                className={`ml-auto w-80 sm:w-96 bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                        aria-label="Close Cart"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="p-4 space-y-4 overflow-y-auto max-h-[70%]">
                    {cartProducts.length > 0 ? (
                        cartProducts
                    ) : (
                        <p className="text-gray-500 text-sm text-center">Your cart is empty 🛒</p>
                    )}
                </div>


                {/* Checkout */}
                <div className="absolute bottom-0 w-full p-4 border-t bg-white">
                    <button onClick={
                        checkOutHandler
                    } className="w-full cursor-pointer py-3 bg-[#C19B50] text-white font-semibold rounded-md hover:bg-[#A0853F] transition-colors duration-200">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
