function Footer() {
    return (
        <footer className=" text-gray-800 py-12">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand / About */}
                <div>
                    <h2 className="text-white text-xl font-bold mb-4">MyStore</h2>
                    <p className="md:text-sm text-xl leading-relaxed">
                        A modern e-commerce platform delivering high-quality fashion and jewelry.
                        We believe in elegance, style, and affordable luxury.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><p className="cursor-pointer hover:text-yellow-500">Home</p></li>
                        <li><p className="cursor-pointer hover:text-yellow-500">Shop</p></li>
                        <li><p className="cursor-pointer hover:text-yellow-500">About Us</p></li>
                        <li><p className="cursor-pointer hover:text-yellow-500">Contact</p></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Customer Service</h3>
                    <ul className="space-y-2 text-sm">
                        <li><p className="cursor-pointer hover:text-yellow-500">FAQs</p></li>
                        <li><p className="cursor-pointer hover:text-yellow-500">Shipping & Returns</p></li>
                        <li><p className="cursor-pointer hover:text-yellow-500">Privacy Policy</p></li>
                        <li><p className="cursor-pointer hover:text-yellow-500">Terms & Conditions</p></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                    <p className="text-sm mb-3">Subscribe to get the latest offers & updates.</p>
                    <form className="flex items-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 rounded-l-lg text-sm text-gray-900 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-sm px-4 py-2 rounded-r-lg text-black font-semibold"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} MyStore. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
