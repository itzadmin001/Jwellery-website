import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../../Components/Website/ProductCard"; // adjust path as needed
import Product3 from "../../../public/Images/_BG70137.jpg"
import { useDispatch, useSelector } from "react-redux";
import { MainContext } from "../../ContextMain";
import axios from "axios";
import { DbToWishList } from "../../Reducers/WishList";


function WishList() {
    // Sample wishlist products
    const wishlist = useSelector(state => state.wishlist.data)
    const { BACKEND_URL, WishListBaseUrl, Productdata } = useContext(MainContext)
    const [WishListProduct, SetWishListProduct] = useState([])

    useEffect(() => {
        axios
            .get(BACKEND_URL + WishListBaseUrl + "/get", {
                withCredentials: true,
            })
            .then((success) => {
                const serverProducts = success.data?.result?.product || [];

                if (serverProducts.length > 0) {
                    // ✅ DB me data mil gaya
                    SetWishListProduct(serverProducts);
                } else if (wishlist.length > 0) {
                    // 🚨 Redux wishlist se IDs nikal lo
                    const wishlistIds = wishlist.map((item) => item.pId);

                    // Productdata me se matching products filter karo
                    const matchedProducts = Productdata.filter((item) =>
                        wishlistIds.includes(item._id)
                    );

                    SetWishListProduct(matchedProducts);
                } else SetWishListProduct([]);
            })
            .catch((err) => {
                console.log("Wishlist fetch error:", err);

                if (wishlist.length > 0) {
                    const wishlistIds = wishlist.map((item) => item.pId);
                    const matchedProducts = Productdata.filter((item) =>
                        wishlistIds.includes(item._id)
                    );
                    SetWishListProduct(matchedProducts);
                }
            });
    }, [wishlist]);



    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
            {/* Page Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
                <p className="text-gray-500 mt-2">
                    All your favorite products in one place
                </p>
            </div>

            {/* Wishlist Products Grid */}
            {WishListProduct.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {WishListProduct?.map((item, i) => (
                        <ProductCard data={item} key={item._id}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">
                    Your wishlist is empty.
                </p>
            )}
        </div>
    );
}

export default WishList;
