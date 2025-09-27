import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaHeart } from "react-icons/fa";
import LOGO from "../../public/LOGO.png";

function Footer() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Company Info & Logo */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <img src={LOGO} alt="Deen Dayal Rajkumar Jewellers" className="h-16 w-auto mb-4" />
                            <h3 className="text-2xl font-serif font-bold text-yellow-500 mb-2">
                                Deen Dayal Rajkumar Jewellers
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Four centuries of Meenakari heritage. Exquisite handcrafted jewelry that tells stories of tradition, elegance, and timeless beauty.
                            </p>
                        </div>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <Link to="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                                <FaFacebook className="text-white text-sm" />
                            </Link>
                            <Link to="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                                <FaInstagram className="text-white text-sm" />
                            </Link>
                            <Link to="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                                <FaTwitter className="text-white text-sm" />
                            </Link>
                            <Link to="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                                <FaYoutube className="text-white text-sm" />
                            </Link>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-yellow-500">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <FaMapMarkerAlt className="text-yellow-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">
                                        A139, Nadpuri Colony, Gurusharan Chabra Marg,<br />
                                        Hawa Sadak, Jaipur 302019,<br />
                                        Rajasthan, India
                                    </p>
                                    <Link
                                        to="https://www.google.com/maps/search/Emporia%20Doctor%20by%20Deepak%20Sankit/@26.89775144,75.78108035,17z"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-yellow-500 hover:text-yellow-400 text-sm mt-1 inline-block"
                                    >
                                        View on Google Maps
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <FaPhone className="text-yellow-500 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">0141-2991918</p>
                                    <p className="text-gray-300 text-sm">+91-9414051055</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <FaEnvelope className="text-yellow-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm">info@emporiadr.com</p>
                                    <p className="text-gray-300 text-sm">deepaksankit@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <FaClock className="text-yellow-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 text-sm font-semibold">Shop Hours:</p>
                                    <p className="text-gray-300 text-sm">Monday - Saturday</p>
                                    <p className="text-gray-300 text-sm">11:00 AM - 7:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-yellow-500">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Home</Link></li>
                            <li><Link to="/store" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Shop</Link></li>
                            <li><Link to="/about" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Contact Us</Link></li>
                            <li><Link to="/gallery" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Gallery</Link></li>
                        </ul>
                    </div>

                    {/* Policies & Newsletter */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-yellow-500">Policies</h4>
                        <ul className="space-y-3 mb-8">
                            <li><Link to="/privacy-policy" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Privacy Policy</Link></li>
                            <li><Link to="/refund-policy" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Refund & Returns</Link></li>
                            <li><Link to="/terms-conditions" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 text-sm">Terms & Conditions</Link></li>
                        </ul>

                        {/* Newsletter Subscription */}
                        <div>
                            <h4 className="text-xl font-bold mb-4 text-yellow-500">Newsletter</h4>
                            <p className="text-gray-300 text-sm mb-4">
                                Subscribe to get the latest jewelry collections and exclusive offers.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                                </button>
                            </form>
                            {isSubscribed && (
                                <p className="text-green-400 text-sm mt-2">
                                    Thank you for subscribing! You'll receive our latest updates soon.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} Deen Dayal Rajkumar Jewellers. All rights reserved.
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                Crafted with <FaHeart className="inline text-red-500" /> in Jaipur, India
                            </p>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span>400+ Years of Heritage</span>
                            <span>•</span>
                            <span>Since 1952</span>
                            <span>•</span>
                            <span>100% Authentic</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
