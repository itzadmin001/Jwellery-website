import axios from 'axios';
import React, { useContext, useState } from 'react';
import { MainContext } from '../../ContextMain';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../Reducers/UserSlice';

function AdminLogin() {
    const { BACKEND_URL, UserBaseUrl, notify } = useContext(MainContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            email,
            password
        }

        axios.post(BACKEND_URL + UserBaseUrl + "/admin/me", data, {
            withCredentials: true
        }).then((success) => {
            dispatch(login(success.data.user))
            notify(success.data.message, "success")
            navigate("/admin")
        }).catch((err) => {
            notify(err.response.data.message, "error")
        })
        setPassword("")
        setEmail("")
        // yaha backend API call kar sakte ho
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
