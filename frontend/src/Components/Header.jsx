// Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container"
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

const menus = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/shop" },
    { name: "Gallery", to: "/gallery" },
    { name: "About", to: "/about" },
    { name: "Contact Us", to: "/contact" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="w-full">
            <div className="w-full bg-gray-800 text-gray-200 text-xs">
                <div className="mx-auto px-4 sm:px-6 flex items-center justify-center h-8">
                    <div className=" border-b">
                        <span>COD & FREE SHIPPING</span>
                    </div>
                </div>
            </div>
            <div className="bg-white">
                <Container classes="sm:px-6 py-6 flex items-center justify-center">
                    <div className="w-2/4 flex justify-center items-center">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                                <div className="font-serif text-2xl md:text-3xl tracking-wider">
                                    <span className="text-gray-800">Jewellery</span>
                                </div>
                                <div className="h-0.5 w-16 bg-gray-200 rounded hidden sm:block" />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Feel the difference</div>
                        </div>
                    </div>
                </Container>
            </div>
            <nav className="bg-white shadow">
                <Container className="sm:px-6">
                    <div className="flex items-center  justify-between h-12">

                        <div className="md:hidden block uppercase font-semibold">
                            <h1>Emporia <span className=" text-yellow-500">Dr </span></h1>
                        </div>
                        <div className="hidden md:flex space-x-4 font-semibold">
                            {menus.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className="text-sm text-gray-600 duration-300 hover:text-yellow-500 transition"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="w-1/4 flex justify-end items-center gap-4">
                            <button className="hidden cursor-pointer md:inline-flex  duration-300 items-center p-2 rounded hover:bg-gray-100">
                                <FiSearch size={18} />
                            </button>
                            <Link to="/wishlist" className="hidden md:inline-flex duration-300 items-center p-2 rounded hover:bg-gray-100">
                                <FiHeart size={18} />
                            </Link>
                            <Link to="/cart" className="inline-flex items-center duration-300 p-2 rounded hover:bg-gray-100">
                                <FiShoppingCart size={18} />
                                <span className="ml-1 text-sm hidden sm:inline">0 items - $0.00</span>
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

                    {/* Mobile nav  */}
                    {mobileOpen && (
                        <div className="md:hidden py-4">
                            <div className="flex flex-col space-y-2">
                                {menus.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                <div className="flex items-center justify-center px-3 mt-2">
                                    <Link to="/wishlist" className="px-3 py-2 rounded hover:bg-gray-50">Wishlist</Link>
                                    <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-50">Cart</Link>
                                    <Link to="/account" className="px-3 py-2 rounded hover:bg-gray-50">Login</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </Container>
            </nav>
        </header>
    );
}
