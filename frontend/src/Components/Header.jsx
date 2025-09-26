// Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container"
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import LOGO from "../../public/LOGO.png"

const menus = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/store" },
    { name: "About", to: "/about" },
    { name: "Contact Us", to: "/contact" },
];


export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="w-full ">
            <div className="w-full bg-[#C19B50] text-white text-xs">
                <div className="mx-auto px-4 sm:px-6 flex items-center justify-center h-8">
                    <div className=" border-b">
                        <span>COD & FREE SHIPPING</span>
                    </div>
                </div>
            </div>
            <div className="hidden md:block bg-white/80">
                <Container classes="sm:px-6 sm:py-6 py-3 flex items-center justify-center">
                    <div className="w-2/4 flex justify-center items-center">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-fit">
                                    <img src={LOGO} alt="" className="md:w-1/2 mx-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <nav className="bg-white shadow mb-2">
                <Container classes="sm:px-6">
                    <div className="flex items-center  justify-between h-12">
                        <div className="md:hidden block uppercase font-semibold">
                            <img src={LOGO} alt="" className="w-1/2 " />
                        </div>
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

                        <div className=" flex justify-end items-center gap-2">
                            <button className="hidden cursor-pointer md:inline-flex  duration-300 items-center p-2 rounded hover:bg-gray-100">
                                <FiSearch size={18} />
                            </button>
                            <Link to="/wishlist" className="hidden md:inline-flex duration-300 items-center p-2 rounded hover:bg-gray-100">
                                <FiHeart size={18} />
                            </Link>
                            <Link to="/cart" className=" duration-300 p-2 rounded hover:bg-gray-100">
                                <FiShoppingCart size={18} />
                            </Link>
                            <Link to="/account" className="hidden md:inline-flex duration-300 items-center p-2 rounded hover:bg-gray-100">
                                <FiUser size={18} />
                            </Link>

                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle menu"
                                className="md:hidden p-2 rounded cursor-pointer hover:bg-gray-100"
                            >
                                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu - Simple & Clean */}
                    {mobileOpen && (
                        <div className="md:hidden bg-white border-t border-gray-200">
                            {/* Navigation Menus */}
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

                            {/* Action Buttons */}
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
                                            className="flex items-center justify-center flex-1 py-3 px-4 bg-white border-2 border-[#C19B50] text-[#C19B50] rounded-md font-semibold hover:bg-[#C19B50] hover:text-white transition-colors duration-200"
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
        </header>
    );
}
