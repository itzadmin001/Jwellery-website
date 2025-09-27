// Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";
import WhatsappImage from "../../public/Images/whatsapp-icon.png"


import {
    FiSearch,
    FiHeart,
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
} from "react-icons/fi";
import LOGO from "../../public/LOGO.png";

const menus = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/store" },
    { name: "About", to: "/about" },
    { name: "Contact Us", to: "/contact" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [SearchOpen, SetSearchOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false);


    const navigate = useNavigate()

    const whatsappNumber = "9414051055";

    // Demo Cart Data
    const cartItems = [
        {
            id: 1,
            title: "Elegant Ring",
            price: "₹2,499",
            image:
                "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
        {
            id: 2,
            title: "Gold Necklace",
            price: "₹4,999",
            image:
                "https://images.pexels.com/photos/3266703/pexels-photo-3266703.jpeg?auto=compress&cs=tinysrgb&w=100",
        },
    ];

    return (
        <header className="w-full relative">
            {/* Top Info Bar */}
            <div className="w-full bg-[#C19B50] text-white text-xs">
                <div className="mx-auto px-4 sm:px-6 flex items-center justify-center h-8">
                    <div className="border-b">
                        <span>COD & FREE SHIPPING</span>
                    </div>
                </div>
            </div>

            {/* Whastapp icons */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center group cursor-pointer">
                {/* Hover Text */}
                <span className="hidden group-hover:inline-block rounded-full  bg-green-500 text-white text-sm px-3 py-1  mr-2 transition-all duration-300 whitespace-nowrap">
                    Chat with us on WhatsApp
                </span>

                {/* WhatsApp Button */}
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="  shadow-lg hover:scale-110 transition-transform duration-300"
                >
                    <img src={WhatsappImage} alt="WhatsApp" className="w-15" />
                </a>
            </div>
            {/* Logo */}
            <div className="hidden md:block bg-white/80">
                <Container classes="sm:px-6 sm:py-6 py-3 flex items-center justify-center">
                    <div className="w-2/4 flex justify-center items-center">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-fit" >
                                    <img
                                        src={LOGO}
                                        alt="Website Logo"
                                        className="md:w-1/2 mx-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Navbar */}
            <nav className="bg-white shadow mb-2">
                <Container classes="sm:px-6">
                    <div className="flex items-center justify-between h-12">
                        {/* Mobile Logo */}
                        <div className="md:hidden block uppercase font-semibold" onClick={() => navigate(-1)}>
                            <img src={LOGO} alt="Logo" className="w-1/2" />
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-4 font-semibold">
                            {menus.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className="text-sm text-gray-800 duration-300 hover:text-yellow-500 transition"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end items-center gap-2">
                            <div className="md:flex hidden items-center gap-2 relative">
                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Type something..."
                                    className={`transition-all duration-300 ease-in-out border rounded py-1 px-3 outline-none md:w-0 w-0  opacity-0 ${SearchOpen ? "md:w-40 w-32 opacity-100" : ""
                                        }`}
                                />

                                {/* Search Button */}
                                <button
                                    onClick={() => SetSearchOpen(!SearchOpen)}
                                    className="hidden md:inline-flex cursor-pointer duration-300 items-center p-2 rounded hover:bg-gray-100"
                                >
                                    <FiSearch size={18} />
                                </button>
                            </div>

                            <button
                                onClick={() => setCartOpen(true)}
                                className="duration-300 cursor-pointer p-2 rounded hover:bg-gray-100 relative"
                                aria-label="Open Cart"
                            >
                                <FiShoppingCart size={18} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                            <div className="relative hidden md:inline-flex">
                                <button
                                    onMouseEnter={() => setUserMenuOpen(true)}
                                    onMouseLeave={() => setUserMenuOpen(false)}
                                    className="duration-300 items-center p-2 rounded hover:bg-gray-100 cursor-pointer flex"
                                >
                                    <FiUser size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <div
                                        onMouseEnter={() => setUserMenuOpen(true)}
                                        onMouseLeave={() => setUserMenuOpen(false)}
                                        className="absolute right-0 top-6  mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-300"
                                    >
                                        <ul className="flex flex-col">
                                            <li className="hover:bg-gray-100 transition px-4 py-2 cursor-pointer">
                                                <Link to="/profile" className="flex items-center gap-2">
                                                    <FiUser /> Profile
                                                </Link>
                                            </li>
                                            <li className="hover:bg-gray-100 transition px-4 py-2 cursor-pointer">
                                                <Link to="/wishlist" className="flex items-center gap-2">
                                                    <FiHeart /> Wishlist
                                                </Link>
                                            </li>
                                            <li
                                                onClick={() => alert("Logged out successfully!")}
                                                className="hover:bg-gray-100 transition px-4 py-2 cursor-pointer flex items-center gap-2"
                                            >
                                                <FiLogOut /> Logout
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                className="md:hidden p-2 rounded cursor-pointer hover:bg-gray-100"
                            >
                                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="md:hidden bg-white border-t border-gray-200">
                            <div className="px-4 py-3">
                                <div className="space-y-1">
                                    {menus.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            onClick={() => setMobileOpen(false)}
                                            className="block py-3 px-3 text-gray-700 hover:bg-[#C19B50] hover:text-white rounded-md transition-colors duration-200 font-medium"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="px-4 py-3 ">
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        to="/account"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-center py-3 px-4 bg-[#C19B50] text-white rounded-md font-semibold hover:bg-[#A0853F] transition-colors duration-200"
                                    >
                                        <FiUser className="mr-2" size={18} />
                                        Login
                                    </Link>

                                    <div className="flex space-x-2">
                                        <Link
                                            to="/cart"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex cursor-pointer items-center justify-center flex-1 py-3 px-4 bg-white border-2 border-[#C19B50] text-[#C19B50] rounded-md font-semibold hover:bg-[#C19B50] hover:text-white transition-colors duration-200"
                                        >
                                            <FiShoppingCart className="mr-2" size={18} />
                                            Cart
                                        </Link>

                                        <Link
                                            to="/wishlist"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center flex-1 py-3 px-4 bg-white border-2 border-[#C19B50] text-[#C19B50] rounded-md font-semibold hover:bg-[#C19B50] hover:text-white transition-colors duration-200"
                                        >
                                            <FiHeart className="mr-2" size={18} />
                                            Wishlist
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Container>
            </nav>

            {/* Cart Sidebar with Animation */}
            <div
                className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${cartOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                aria-modal="true"
                role="dialog"
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setCartOpen(false)}
                ></div>

                {/* Sidebar */}
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
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 border-b pb-3"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">{item.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">Your cart is empty.</p>
                        )}
                    </div>

                    {/* Checkout */}
                    <div className="absolute bottom-0 w-full p-4 border-t bg-white">
                        <button className="w-full cursor-pointer py-3 bg-[#C19B50] text-white font-semibold rounded-md hover:bg-[#A0853F] transition-colors duration-200">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </header >
    );
}
