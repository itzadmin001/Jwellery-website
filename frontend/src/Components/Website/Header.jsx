// Header.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";
import WhatsappImage from "../../../public/Images/whatsapp-icon.png"
import { TbShoppingCartCopy } from "react-icons/tb";

import {
    FiSearch,
    FiHeart,
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    FiLogOut,
} from "react-icons/fi";
import LOGO from "../../../public/LOGO.png";
import { MainContext } from "../../ContextMain";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Reducers/UserSlice";
import Cart from "../../Pages/Website/Cart";

const menus = [
    { name: "Home", to: "/" },
    { name: "Shop", to: "/store" },
    { name: "About", to: "/about" },
    { name: "Contact Us", to: "/contact" },
];

export default function Header() {
    const user = useSelector(state => state.user.data)
    const { cartOpen, setCartOpen, Productdata } = useContext(MainContext)
    const [mobileOpen, setMobileOpen] = useState(false);

    const [SearchOpen, SetSearchOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);


    const navigate = useNavigate()
    const dispatch = useDispatch()

    const whatsappNumber = "9414051055";

    // Demo Cart Data


    const handleClick = () => {
        if (!user) {
            navigate("/login");
        }
    };


    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            setResults([]);
            return;
        }
        const matched = Productdata.filter((p) =>
            (p.name || "").toLowerCase().includes(q)
        ).slice(0, 5); // show up to 5
        setResults(matched);
    }, [query]);

    /* click outside or ESC to close dropdown */
    useEffect(() => {
        if (!SearchOpen) return;

        const onDocClick = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                SetSearchOpen(false);
                setQuery("");
                setResults([]);
            }
        };

        const onKey = (e) => {
            if (e.key === "Escape") {
                SetSearchOpen(false);
                setQuery("");
                setResults([]);
            }
        };

        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [SearchOpen]);


    const handleSelect = (prod) => {
        navigate(`/productdetails/${prod._id}`);
        SetSearchOpen(false);
        setQuery("");
        setResults([]);
    };


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
                                        className="md:w-1/2 mx-auto "
                                        onClick={() => navigate("/")}
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
                            <div className="md:flex hidden  items-center gap-2 relative">
                                {/* Search Input */}
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => SetSearchOpen(true)}
                                    type="text"
                                    placeholder="Type something..."
                                    className={`transition-all duration-300 ease-in-out bg-gray-100 rounded py-1 px-3 outline-none md:w-0 w-0 opacity-0 ${SearchOpen ? "md:w-40 w-32 opacity-100" : ""
                                        }`}
                                />

                                {/* Search Button */}
                                <button
                                    onClick={() => SetSearchOpen(!SearchOpen)}
                                    className="hidden md:inline-flex cursor-pointer duration-300 items-center p-2 rounded hover:bg-gray-100"
                                >
                                    <FiSearch size={18} />
                                </button>

                                { /* DROPDOWN: render when SearchOpen true */}
                                {SearchOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute bg-white  shadow   rounded-md top-10 -left-10 p-4 w-80 z-50"
                                        style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}
                                    >
                                        {/* inner area constrained — scroll only inside this box */}
                                        <div className="max-h-56 overflow-y-auto  productSearchbar">
                                            {/* If empty query */}
                                            {query.trim() === "" ? (
                                                <div className="text-sm text-gray-500 p-2">No product found</div>
                                            ) : results.length === 0 ? (
                                                <div className="text-sm text-gray-500 p-2">No product found</div>
                                            ) : (
                                                results.map((p) => (
                                                    <button
                                                        key={p._id}
                                                        onClick={() => handleSelect(p)}
                                                        className="w-full border-b-[1px] text-left px-2 cursor-pointer py-2 hover:bg-gray-100 rounded flex items-center gap-3"
                                                    >
                                                        {/* thumbnail */}
                                                        {p.image ? (
                                                            <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded" />
                                                        )}

                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                                                            {p.price && <div className="text-xs text-gray-500">₹{p.price}</div>}
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setCartOpen(true)}
                                className="duration-300 cursor-pointer p-2 rounded hover:bg-gray-100 "
                                aria-label="Open Cart"
                            >
                                <FiShoppingCart size={18} />

                            </button>
                            <div className="relative hidden md:inline-flex">
                                <button
                                    onClick={handleClick}
                                    onMouseEnter={() => user && setUserMenuOpen(true)}
                                    onMouseLeave={() => user && setUserMenuOpen(false)}
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
                                            <li className="hover:bg-gray-100 transition px-4 py-2 cursor-pointer">
                                                <Link to="/orders" className="flex items-center gap-2">
                                                    <TbShoppingCartCopy /> My orders
                                                </Link>
                                            </li>
                                            <li
                                                onClick={() => {
                                                    dispatch(logout())
                                                    setUserMenuOpen(false)
                                                }}
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
                                    {
                                        user ? <Link
                                            to="/profile"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center py-3 px-4 bg-[#C19B50] text-white rounded-md font-semibold hover:bg-[#A0853F] transition-colors duration-200"
                                        >
                                            <FiUser className="mr-2" size={18} />
                                            My Profile
                                        </Link> : <Link
                                            to="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center py-3 px-4 bg-[#C19B50] text-white rounded-md font-semibold hover:bg-[#A0853F] transition-colors duration-200"
                                        >
                                            <FiUser className="mr-2" size={18} />
                                            Login
                                        </Link>
                                    }

                                    <div className="flex space-x-2">
                                        <Link
                                            onClick={() => {
                                                setCartOpen(true)
                                                setMobileOpen(false)
                                            }}
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
            <Cart cartOpen={cartOpen} setCartOpen={setCartOpen} />
        </header >
    );
}
