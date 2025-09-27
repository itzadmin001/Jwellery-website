import React from "react";
import ProductCard from "../Components/ProductCard"; // adjust path as needed
import Product3 from "../../public/Images/_BG70137.jpg"


function WishList() {
    // Sample wishlist products
    const wishlistItems = [
        {
            id: 1,
            image: Product3,
            title: "Elegant Diamond Ring",
            price: "2,499",
        },
        {
            id: 2,
            image: Product3,
            title: "Gold Plated Bracelet",
            price: "3,499",
        },
        {
            id: 3,
            image: Product3,
            title: "Elegant Silver Necklace",
            price: "1,200",
        },
        {
            id: 4,
            image: Product3,
            title: "Luxury Earrings",
            price: "1,999",
        },
    ];

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
            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <ProductCard
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            price={item.price}
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
