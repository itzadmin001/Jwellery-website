import { GiRoundStar } from "react-icons/gi";

function ProductCard({ image, title, price }) {
    return (
        <div className="  cursor-pointer shadow-md hover:shadow transition-shadow duration-300  w-full max-w-xs mx-auto">
            {/* Product Image */}
            <div className="relative flex justify-center bg-[#FDFDFD] py-4">
                <img
                    src={image}
                    alt={title}
                    className="w-40 h-40 object-contain transition-transform duration-300 hover:scale-105"
                />
            </div>

            <div className="text-center mt-2 py-2 px-4">

                <div className="flex justify-center items-center mb-1 text-yellow-500">
                    {[...Array(4)].map((_, i) => (
                        <GiRoundStar key={i} size={16} fill="currentColor" />
                    ))}
                    <GiRoundStar size={16} className="text-gray-300" />
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-base font-medium text-gray-800 truncate">
                    {title}
                </h3>

                {/* Price */}
                <p className="text-lg font-semibold text-gray-900 mt-1">${price}</p>

                {/* CTA Button */}
                <button className="mt-2 mb-2 cursor-pointer sm:px-4 px-2 sm:py-2 py-1 border-2 border-yellow-500 font-semibold  text-yellow-500 sm:text-sm text-xs rounded-sm hover:bg-yellow-600 hover:text-white transition-colors duration-300">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard
