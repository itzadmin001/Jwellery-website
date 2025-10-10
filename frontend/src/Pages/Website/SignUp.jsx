import { useContext, useState } from "react";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SignupUser } from "../../Reducers/UserSlice";
import { useDispatch } from "react-redux";
import { MainContext } from "../../ContextMain";
import axios from "axios";

function SignUp() {
    const { notify, UserBaseUrl, BACKEND_URL } = useContext(MainContext)
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "",
        terms: false,
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const validate = () => {
        let newErrors = {};

        // Name
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        // Phone
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        // Password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm Password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Gender
        if (!formData.gender) {
            newErrors.gender = "Please select your gender";
        }

        // Terms
        if (!formData.terms) {
            newErrors.terms = "You must agree to the Terms & Conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        setButtonDisabled(true);
        e.preventDefault();
        if (validate()) {
            axios.post(BACKEND_URL + UserBaseUrl + "/register", formData)
                .then((success) => {
                    console.log(success)
                    notify(success.data.message, "success")
                    dispatch(SignupUser(success.data.user))
                    navigate("/")
                    setButtonDisabled(false);
                })
                .catch((error) => {
                    console.log(error)
                    notify(error.response.data.message, "error")
                })
            setButtonDisabled(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                gender: "",
                terms: false,
            });
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
                {/* Title */}
                <h2 className="text-3xl font-semibold text-center text-gray-800">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mt-2">
                    Join our Jewellery Store family ✨
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    {/* Name */}
                    <div>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                            <FiUser className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                            <FiMail className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                            <FiPhone className="text-gray-400 mr-2" />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                            <FiLock className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                            <FiLock className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full outline-none"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>


                    {/* Terms */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                        />
                        <p className="text-sm text-gray-600">
                            I agree to the{" "}
                            <span className="text-yellow-600 cursor-pointer">
                                Terms & Conditions
                            </span>
                        </p>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition duration-300 ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Sign Up
                    </button>
                </form>

                {/* Already have account */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <span
                        className="text-yellow-600 font-medium cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Log In
                    </span>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
