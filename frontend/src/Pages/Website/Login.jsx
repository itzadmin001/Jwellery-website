import { useContext, useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../../Reducers/UserSlice";
import { MainContext } from "../../ContextMain";
import axios from "axios";
import { DbTocart } from "../../Reducers/CartSlice";
import { DbToWishList } from "../../Reducers/WishList"

function Login() {
    const { notify, UserBaseUrl, BACKEND_URL, CartBaseUrl, WishListBaseUrl } = useContext(MainContext)
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const user = useSelector(state => state.user.data)
    const cart = useSelector(state => state.cart)
    const wishlist = useSelector(state => state.wishlist.data)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()


    useEffect(
        () => {
            if (user != null) {
                if (searchParams.get("ref") != null) {
                    navigate("/checkout")
                } else {
                    navigate("/")
                }
            }

        }, [user]
    )



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        setButtonDisabled(true);
        e.preventDefault();
        if (validate()) {

            axios.post(BACKEND_URL + UserBaseUrl + "/login", formData, {
                withCredentials: true
            }).then((success) => {
                notify(success.data.message, "success")
                dispatch(login(success.data.user));

                if (cart.data !== undefined) {
                    axios.post(BACKEND_URL + CartBaseUrl + "/create", { product_id: cart.data }, {
                        withCredentials: true
                    })
                        .then((success) => {
                            if (success.data.data.length != 0) {
                                let total = 0
                                const newcart = success.data.data.map(
                                    (cat) => {
                                        total += cat.qty * cat.product.price
                                        return {
                                            pId: cat.product._id,
                                            qty: cat.qty,
                                        }
                                    }
                                )
                                dispatch(DbTocart({ newcart, total }))
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                }
                if (wishlist.length > 0) {
                    const productIds = wishlist.map(item => item.pId);
                    axios.post(BACKEND_URL + WishListBaseUrl + "/create", { productIds }, {
                        withCredentials: true
                    })
                        .then((success) => {
                            const formattedWishlist = success.data.wishlist.product.map(id => ({ pId: id }))
                            dispatch(DbToWishList(formattedWishlist))
                        }).catch((err) => {
                            console.log(err)
                        })
                }

                navigate("/");
            }).catch((err) => {
                notify(err, "error")
                console.log(err)
            })
            setFormData({
                email: "",
                password: "",
            });
            setButtonDisabled(false)

        }
    };




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                {/* Title */}
                <h2 className="text-3xl font-semibold text-center text-gray-800">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 mt-2">
                    Login to your Jewellery Store account ✨
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Email */}
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                        <FiMail className="text-gray-400 mr-2" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full outline-none"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400">
                        <FiLock className="text-gray-400 mr-2" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full outline-none"
                            required
                        />
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-yellow-500" />
                            Remember Me
                        </label>
                        <span className="text-yellow-600 cursor-pointer hover:underline">
                            Forgot Password?
                        </span>
                    </div>

                    {/* Login Button */}

                    <button
                        type="submit"
                        className={`w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition duration-300 ${buttonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>



                {/* Sign Up Redirect */}
                <p className="text-center text-sm text-gray-600 mt-6 ">
                    Don’t have an account?{" "}
                    <span className="text-yellow-600  font-medium cursor-pointer" onClick={() => navigate("/sign-up")}>
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
