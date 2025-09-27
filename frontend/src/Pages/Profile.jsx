import React from "react";
import Container from "../Components/Container";

function Profile() {
    return (
        <section className="bg-white py-12 px-4 md:px-0">

            <Container classes="  bg-gray-50 shadow rounded-2xl p-8">
                {/* Page Heading */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-6">
                    Profile
                </h1>
                <p className="text-center text-gray-600 mb-10">
                    Manage your personal information for a seamless shopping experience.
                </p>

                {/* Profile Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="fullName"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Enter your full name"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="+91 98765 43210"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="dob"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dob"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="gender"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Gender
                        </label>
                        <select
                            id="gender"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        >
                            <option value="">Select</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Country */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="country"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            placeholder="India"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* State */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="state"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            placeholder="Rajasthan"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* City */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="city"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            placeholder="Jaipur"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* Postal Code */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="postalCode"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Postal Code
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder="302001"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col md:col-span-2">
                        <label
                            htmlFor="address"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Full Address
                        </label>
                        <textarea
                            id="address"
                            rows="3"
                            placeholder="Enter your complete address"
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        ></textarea>
                    </div>

                    {/* Save Button */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full py-3 px-6 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition duration-300"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>
            </Container>

        </section>
    );
}

export default Profile;
