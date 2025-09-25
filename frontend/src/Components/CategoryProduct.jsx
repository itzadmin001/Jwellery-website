function CategoryProduct({ data }) {
    return (
        <div className="flex flex-col items-center group cursor-pointer">
            {/* Image container */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-[#f4c24f] shadow-sm group-hover:shadow-md transition-all duration-300">
                <img
                    src={data.imageUrl}
                    alt={data.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Category Name */}
            <h1 className="font-medium text-center text-xs md:text-base mt-2 text-gray-800 group-hover:text-[#c09529] transition-colors duration-300">
                {data.name}
            </h1>
        </div>
    );
}



export default CategoryProduct;

