import { GiRoundStar } from "react-icons/gi";

function ProductCard({ image, title, price }) {
    return (
        <div className="rounded-2xl bg-[#FDFDFD] cursor-pointer shadow-md hover:shadow transition-shadow duration-300 p-4 w-full max-w-xs mx-auto">
            {/* Product Image */}
            <div className="relative flex justify-center">
                <img
                    src={image}
                    alt={title}
                    className="w-40 h-40 object-contain transition-transform duration-300 hover:scale-105"
                />
            </div>

            <div className="text-center mt-2">

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
                <button className="mt-2 cursor-pointer px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors duration-300">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard
