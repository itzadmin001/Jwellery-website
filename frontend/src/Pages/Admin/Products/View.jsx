import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../ContextMain";
import axios from "axios";
import { useNavigate } from "react-router-dom";






function View() {


    const { fetchProduct, BACKEND_URL, ProductBaseUrl } = useContext(MainContext)
    const [Products, SetProduct] = useState([])
    const [limit, Setlimit] = useState(20);



    const navigate = useNavigate()

    const getProduct = () => {
        fetchProduct({ limit })
            .then((success) => {
                console.log(success)
                SetProduct(success.data)
            }).catch((err) => {
                console.log(err)
            })
    }



    useEffect(() => {
        getProduct()
    }, [limit])



    const toggleBoolean = (id, field, new_status) => {
        axios.patch(BACKEND_URL + ProductBaseUrl + "/update-status", {}, {
            params: { id, field, new_status },
            withCredentials: true,
        })
            .then((success) => {
                getProduct()
            }).catch((err) => {
                console.log(err)
            })
    };



    const removeProduct = (prodId) => {
        axios.delete(`${BACKEND_URL}${ProductBaseUrl}/delete/${prodId}`, {
            withCredentials: true
        })
            .then((success) => {
                getProduct()
            }).catch((err) => {
                console.log(err)
            })

    };





    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Products</h1>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                            <tr>
                                <th className="px-2 py-3 text-left text-sm font-medium">#</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Main</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Name</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Slug</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Price</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Category</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">
                                    Subcategory
                                </th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Related</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Featured</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Stock</th>
                                <th className="px-2 py-3 text-left text-sm font-medium">Sale</th>
                                <th className="px-2 py-3 text-center text-sm font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {
                                Products.length > 0 ?
                                    Products.map((p, idx) => (
                                        <tr
                                            key={p._id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-4 py-4 text-sm text-gray-600">{idx + 1}</td>

                                            {/* Main image */}
                                            <td className="px-4 py-4">
                                                <div className="w-16 h-16 rounded-md overflow-hidden border">
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover"
                                                        title={p.image}
                                                    />
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td className="px-2 py-4 font-semibold text-gray-800">{p.name}</td>

                                            {/* Slug */}
                                            <td className="px-2 py-4 text-sm text-gray-600">{p.slug}</td>

                                            {/* Price */}
                                            <td className="px-2 py-4 text-sm text-gray-700">
                                                ₹{Number(p.price).toLocaleString("en-IN")}
                                            </td>

                                            {/* Category */}
                                            <td className="px-2 py-4 text-sm text-gray-700">
                                                {p.category.name}
                                            </td>

                                            {/* Subcategory */}
                                            <td className="px-2 py-4 text-sm text-gray-700">
                                                {p.subcategory.name}
                                            </td>



                                            {/* Related images */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {Array.isArray(p.relatedImage) && p.relatedImage.length > 0 ? (
                                                        p.relatedImage.map((ri, i) => (
                                                            <img
                                                                key={i}
                                                                src={ri}
                                                                alt={`rel-${i}`}
                                                                className="w-10 h-10 object-cover rounded border"
                                                                title={ri}
                                                            />
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-gray-400">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Featured (boolean pill) */}
                                            <td className="px-4 py-4">
                                                {p.featured ? (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-green-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "featured", false)}
                                                    >
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-red-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "featured", true)}
                                                    >
                                                        No
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                {p.status ? (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-green-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "status", false)}
                                                    >
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-red-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "status", true)}
                                                    >
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            {/* Stock */}
                                            <td className="px-4 py-4">
                                                {p.stock ? (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-green-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "stock", false)}
                                                    >
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-red-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "stock", true)}
                                                    >
                                                        Out
                                                    </span>
                                                )}
                                            </td>

                                            {/* Sale */}
                                            <td className="px-4 py-4">
                                                {p.sale ? (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-green-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "sale", false)}
                                                    >
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-red-500 rounded-full text-white"
                                                        onClick={() => toggleBoolean(p._id, "sale", true)}
                                                    >
                                                        No
                                                    </span>
                                                )}
                                            </td>

                                            {/* __v */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex  items-center justify-center gap-2">
                                                    <span className="text-sm bg-blue-600 px-3 text-gray-200 py-1 rounded-md cursor-pointer" onClick={() => navigate("/admin/product/edit/" + p._id)}>Edit</span>
                                                    <button
                                                        onClick={() => removeProduct(p._id)}
                                                        className="px-2 cursor-pointer   py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : <div>not Product Found</div>}
                        </tbody>
                    </table>

                    {/* If no products */}
                    {Products.length === 0 && (
                        <div className="p-6 text-center text-gray-500">No products to show</div>
                    )}
                </div>
                <div className="mt-5 text-center" onClick={() => Setlimit(limit + 10)}>
                    <button className=" bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Load More</button>
                </div>
            </div>
        </div>
    );
}

export default View;
