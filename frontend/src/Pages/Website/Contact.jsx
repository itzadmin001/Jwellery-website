import React from "react";

export default function Contact() {
    return (
        <div className="bg-white text-gray-800">
            {/* Hero Section */}
            <section className="text-center py-12 bg-gradient-to-r from-[#D19E53] via-white to-[#dcd4c9]">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg max-w-2xl mx-auto text-gray-600">
                    We’d love to hear from you! Fill out the form or reach us directly
                    using the details below.
                </p>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
                {/* Contact Details */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                    <div>
                        <p className="text-gray-700 font-medium">Phone:</p>
                        <p className="text-gray-500 text-sm">0141-2991918</p>
                        <p className="text-gray-500 text-sm">+91-9414051055</p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Address:</p>
                        <p className="text-gray-500 text-sm">
                            A139, Nadpuri Colony, Gurusharan Chabra Marg, <br />
                            Hawa Sadak, Jaipur 302019, <br />
                            Rajasthan, India
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-700 font-medium">Email:</p>
                        <p className="text-gray-500 text-sm">info@emporiadr.com</p>
                        <p className="text-gray-500 text-sm">deepaksankit@gmail.com</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 shadow-sm rounded-2xl p-6">
                    <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                required
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                required
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Your Email"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        <textarea
                            placeholder="Your Message"
                            rows="5"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 cursor-pointer text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </section>

            {/* Google Map */}
            <section className="max-w-7xl mx-auto px-6 pb-12">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Find Us on Map
                </h2>
                <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        title="Emporia Doctor by Deepak Sankit"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3559.338227869964!2d75.78108035!3d26.89775144!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s26.89775144%2C75.78108035!2sEmporia%20Doctor%20by%20Deepak%20Sankit!5e0!3m2!1sen!2sin!4v1695739912345!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

            </section>
        </div>
    );
}
