// ContextMain.jsx
import React, { createContext, useEffect, useState } from "react";
import Product3 from "../public/Images/_BG70137.jpg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const MainContext = createContext();

function ContextMain(props) {
    const [cartOpen, setCartOpen] = useState(false);
    const [Category, SetCategory] = useState([]); // Category
    const [Productdata, SetProductdata] = useState([]); // Product
    const [loading, setLoading] = useState(false);

    const notify = (msg, flag) => toast(msg, { type: flag });

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const UserBaseUrl = import.meta.env.VITE_USER_BASE_URL;
    const CategoryBaseUrl = import.meta.env.VITE_CATEGORY_BASE_URL;
    const ProductBaseUrl = import.meta.env.VITE_PRODUCTS_BASE_URL;
    const CartBaseUrl = import.meta.env.VITE_CART_BASE_URL;
    const OrderBaseUrl = import.meta.env.VITE_ORDER_BASE_URL;
    const PaymentbaseUrl = import.meta.env.VITE_PAYMENT_BASE_URL;
    const WishListBaseUrl = import.meta.env.VITE_WISHLIST_BASE_URL;



    const categoryImages = [
        "public/images/category/SMJ004.JPEG",
        "public/images/category/SB57.JPG",
        "public/images/category/_BG70147.jpg",
        "public/images/category/_BG70285.jpg",
        "public/images/category/DSC_0175.JPG",
        "public/images/category/PSE032,.JPG",
        "public/images/category/PSJ012.JPEG",
        "public/images/category/SAE010.JPEG",
        "public/images/category/SB57.JPG"
    ]


    const fetchProduct = async ({ limit = 0, id, category, price }) => {

        const params = {};
        if (limit) params.limit = limit;
        if (id) params.id = id;
        if (category) params.category = category;
        if (price) params.price = price;

        const QueryLimit = new URLSearchParams(params);
        const response = await fetch(
            BACKEND_URL + ProductBaseUrl + "/get?" + QueryLimit.toString()
        );
        const data = await response.json();
        return data;

    };



    const fectchCategory = async () => {
        try {
            const response = await axios.get(BACKEND_URL + CategoryBaseUrl + "/get", {
                withCredentials: true,
            });
            SetCategory(response.data.data || []);
        } catch (err) {
            SetCategory([]);
            console.error("fectchCategory error:", err);
        }
    };

    useEffect(() => {
        fectchCategory()
        fetchProduct({ limit: 20 })
            .then((success) => {
                SetProductdata(success.data)
            }).catch((err) => {
                console.log(err)
            })
    }, []);

    return (
        <MainContext.Provider
            value={{
                Productdata,
                cartOpen,
                Category,
                categoryImages,
                CartBaseUrl,
                SetProductdata,
                PaymentbaseUrl,
                setCartOpen,
                WishListBaseUrl,
                UserBaseUrl,
                OrderBaseUrl,
                ProductBaseUrl,
                CategoryBaseUrl,
                BACKEND_URL,
                fetchProduct,
                notify,
                fectchCategory,
                loading,
            }}
        >
            <ToastContainer />
            {props.children}
        </MainContext.Provider>
    );
}

export default ContextMain;
export { MainContext };
