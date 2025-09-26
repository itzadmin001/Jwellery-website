import { useState } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaEye, FaShare } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

function ProductCard({
    image,
    title,
    price,
    originalPrice,
    rating = 4.5,
    reviews = 0,
    isNew = false,
    isBestSeller = false,
    discount = null,
    category = "Jewelry"
}) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        // Add to cart logic here
        console.log("Added to cart:", title);
    };

    return (
        <div
            className="group relative bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden w-full max-w-xs sm:max-w-sm mx-auto transform hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-col gap-1 sm:gap-2">
                {isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg">
                        NEW
                    </span>
                )}
                {isBestSeller && (
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg">
                        BEST
                    </span>
                )}
                {discount && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg">
                        {discount}% OFF
                    </span>
                )}
            </div>

            {/* Wishlist Button */}
            <button
                onClick={handleWishlistToggle}
                className={`absolute cursor-pointer top-2 right-2 sm:top-4 sm:right-4 z-20 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 ${isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
            >
                <FaHeart className={`text-xs  sm:text-sm ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Actions - Hidden on mobile for space */}
            <div className={`absolute top-2 right-12 sm:top-4 sm:right-16 z-20 flex flex-col gap-1 sm:gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                } hidden sm:flex`}>
                <button className="p-2 sm:p-3 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300">
                    <FaEye className="text-xs sm:text-sm" />
                </button>
            </div>

            {/* Product Image */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                    src={image}
                    alt={`${title} - ${category}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-6">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                    {category}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-2 sm:mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`text-xs sm:text-sm ${i < Math.floor(rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    {reviews > 0 && (
                        <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                            ({reviews})
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300">
                    {title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2">
                    <span className="text-lg sm:text-2xl font-bold text-gray-900">
                        ${price}
                    </span>
                    {originalPrice && (
                        <span className="text-sm sm:text-lg text-gray-500 line-through">
                            ${originalPrice}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
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
