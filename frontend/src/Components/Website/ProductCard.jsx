import { useContext, useState } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaEye, FaShare } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Reducers/CartSlice";
import { MainContext } from "../../ContextMain";
import { useNavigate } from "react-router-dom";
import { AddToWishlist, DbToWishList, RemoveToWishlist } from "../../Reducers/WishList";
import axios from "axios";

function ProductCard({
    data }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { cartOpen, setCartOpen, BACKEND_URL, WishListBaseUrl } = useContext(MainContext)
    const wishlist = useSelector(state => state.wishlist.data)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleWishlistToggle = (id) => {

        const isInWishlist = wishlist.some(item => item.pId === id);

        if (isInWishlist) {
            dispatch(RemoveToWishlist({ pId: id }));
            axios.get(BACKEND_URL + WishListBaseUrl + "/remove-wishlist", {
                withCredentials: true,
                params: { id }
            })
                .then((success) => {
                }).catch((err) => {
                })

        } else {
            dispatch(AddToWishlist({
                pId: id,
            }));
        }
    };

    const handleAddToCart = () => {

        dispatch(addToCart({
            pId: data._id,
            qty: 1,
            price: data.price
        }))
        setCartOpen(true)
    };

    return (
        <div
            onClick={() => navigate(`/productdetails/${data._id}`)} className="group relative bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {/* Wishlist Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(data._id)
                }}
                className={`absolute cursor-pointer top-2 hover:bg-red-500  right-2 sm:top-4 sm:right-4 z-20 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 ${isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600  hover:text-white'
                    }`}
            >
                <FaHeart
                    className={`text-xs sm:text-sm ${wishlist.some(item => item.pId === data._id) ? 'text-red-500' : 'text-gray-600'
                        }`}
                />
            </button>

            {/* Quick Actions - Hidden on mobile for space */}
            <div className={`absolute top-2 right-12 sm:top-4 sm:right-16 z-20 flex flex-col gap-1 sm:gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                } hidden sm:flex`}>
                <button onClick={() => navigate(`/productdetails/${data._id}`)} className="p-2 sm:p-3 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300">
                    <FaEye className="text-xs sm:text-sm" />
                </button>
            </div>

            {/* Product Image */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                    src={data.image}
                    alt={`${data?.name} `}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-6">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                    {data?.category.name}
                </p>

                {/* Title */}
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300">
                    {data.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
                        ₹{data.price}
                    </h3>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart()
                    }}
                    className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-1 sm:gap-2 group/btn text-xs sm:text-sm"
                >
                    <FaShoppingCart className="text-xs sm:text-sm group-hover/btn:animate-bounce" />
                    <span>Add to Cart</span>
                </button>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    )
}

export default ProductCard
