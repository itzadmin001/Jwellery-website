import React, { useState } from "react";
import Container from "../../Components/Website/Container";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Reducers/UserSlice";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiCheck } from "react-icons/fi"; // edit & save icons

function Profile() {
    const user = useSelector((state) => state.user.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // local states for editing email & phone
    const [isEditing, setIsEditing] = useState({ email: false, phone: false });
    const [updatedData, setUpdatedData] = useState({
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const handleSave = (field) => {
        // yaha API call / Redux dispatch se update karna hoga
        console.log("Updated", field, updatedData[field]);
        setIsEditing({ ...isEditing, [field]: false });
    };

    return (
        <section className="py-8 px-4 md:px-0">
            <Container classes="max-w-md mx-auto shadow rounded-xl p-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    My Profile
                </h1>

                {user && (
                    <div className="space-y-4 text-gray-700">
                        {/* Name */}
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>

                        {/* Email */}
                        <div>
                            <p className="text-sm text-gray-500 flex items-center justify-between">
                                Email
                                {isEditing.email ? (
                                    <FiCheck
                                        className="cursor-pointer text-green-500"
                                        onClick={() => handleSave("email")}
                                    />
                                ) : (
                                    <FiEdit2
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setIsEditing({ ...isEditing, email: true })
                                        }
                                    />
                                )}
                            </p>
                            {isEditing.email ? (
                                <input
                                    type="email"
                                    className="mt-1 w-full p-2 border rounded-md"
                                    value={updatedData.email}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, email: e.target.value })
                                    }
                                />
                            ) : (
                                <p className="font-medium">{updatedData.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <p className="text-sm text-gray-500 flex items-center justify-between">
                                Phone
                                {isEditing.phone ? (
                                    <FiCheck
                                        className="cursor-pointer text-green-500"
                                        onClick={() => handleSave("phone")}
                                    />
                                ) : (
                                    <FiEdit2
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setIsEditing({ ...isEditing, phone: true })
                                        }
                                    />
                                )}
                            </p>
                            {isEditing.phone ? (
                                <input
                                    type="tel"
                                    className="mt-1 w-full p-2 border rounded-md"
                                    value={updatedData.phone}
                                    onChange={(e) =>
                                        setUpdatedData({ ...updatedData, phone: e.target.value })
                                    }
                                />
                            ) : (
                                <p className="font-medium">{updatedData.phone}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{user.gender}</p>
                        </div>

                        {/* Address */}
                        {user.address && (
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">
                                    {user.address.street}, {user.address.city},{" "}
                                    {user.address.state} - {user.address.pincode}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Logout */}
                <div className="mt-6">
                    <button
                        onClick={() => {
                            dispatch(logout());
                            navigate("/");
                        }}
                        className="w-full cursor-pointer py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </Container>
        </section>
    );
}

export default Profile;
