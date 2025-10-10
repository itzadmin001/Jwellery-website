import React, { useState, useEffect, useContext } from "react";
import Card from "../../../Components/Admin/Card";
import { MainContext } from "../../../ContextMain";
import LoadingButton from "../../../Components/Admin/LoadingButton";
import axios from "axios";



function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

function Add() {
    const { Subcategory, Category, BACKEND_URL, ProductBaseUrl } = useContext(MainContext)
    const [loading, Setloading] = useState(false)
    const [form, setForm] = useState({
        name: "",
        slug: "",
        price: "",
        stock: true,
        sale: false,
        featured: false,
        description: "",
        category: "",
        product_category: "",
        image: null,
        relatedImage: [],
    });

    const [errors, setErrors] = useState({});
    const [relatedImageCount, setRelatedImageCount] = useState(0);

    // Generate slug in real-time
    useEffect(() => {
        setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }, [form.name]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            if (name === "image") {
                setForm((prev) => ({ ...prev, image: files[0] }));
            } else if (name === "relatedImage") {
                const fileArr = Array.from(files).slice(0, 5); // max 5
                setForm((prev) => ({ ...prev, relatedImage: fileArr }));
                setRelatedImageCount(fileArr.length);
            }
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.name) errs.name = "Name is required";
        if (!form.price) errs.price = "Price is required";
        if (!form.category) errs.category = "Category is required";
        if (!form.product_category) errs.product_category = "Subcategory is required";
        if (!form.image) errs.image = "Product image is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        Setloading(true);

        try {
            // ✅ FormData banana
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("slug", form.slug);
            formData.append("price", form.price);
            formData.append("stock", form.stock);
            formData.append("sale", form.sale);
            formData.append("featured", form.featured);
            formData.append("description", form.description);
            formData.append("category", form.category);
            formData.append("product_category", form.product_category);

            // ✅ Main image
            if (form.image) {
                formData.append("image", form.image);
            }

            // ✅ Related images (max 5)
            form.relatedImage.forEach((img, index) => {
                formData.append("relatedImage", img);
            });

            // ✅ Request
            const res = await axios.post(
                `${BACKEND_URL}${ProductBaseUrl}/create`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            console.log("✅ Success:", res.data);
            setForm({
                name: "",
                slug: "",
                price: "",
                stock: true,
                sale: false,
                featured: false,
                description: "",
                category: "",
                product_category: "",
                image: null,
                relatedImage: [],
            });
        } catch (err) {
            console.error("❌ Error:", err);
        } finally {
            Setloading(false);
        }
    };
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6 px-4">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-5 px-4">
                {/* Name & Slug */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            readOnly
                            className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                        />
                    </div>
                </div>

                {/* Price */}
                <div>
                    <label className="block mb-1 font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                {/* Stock & Sale toggles */}
                <div className="flex gap-6">
                    {/* Stock Toggle */}
                    <div className="flex items-center gap-2">
                        <label className="font-medium">Stock</label>
                        <div
                            className={`relative cursor-pointer w-12 h-6 transition duration-200 ease-linear rounded-full ${form.stock ? "bg-green-500" : "bg-gray-300"
                                }`}
                            onClick={() => setForm((prev) => ({ ...prev, stock: !prev.stock }))}
                        >
                            <span
                                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${form.stock ? "translate-x-6" : "translate-x-0"
                                    }`}
                            />
                        </div>
                        <span className="text-sm">{form.stock ? "ON" : "OFF"}</span>
                    </div>

                    {/* Sale Toggle */}
                    <div className="flex items-center gap-2">
                        <label className="font-medium">Sale</label>
                        <div
                            className={`relative w-12 cursor-pointer h-6 transition duration-200 ease-linear rounded-full ${form.sale ? "bg-green-500" : "bg-gray-300"
                                }`}
                            onClick={() => setForm((prev) => ({ ...prev, sale: !prev.sale }))}
                        >
                            <span
                                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${form.sale ? "translate-x-6" : "translate-x-0"
                                    }`}
                            />
                        </div>
                        <span className="text-sm">{form.sale ? "ON" : "OFF"}</span>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-2">
                        <label className="font-medium">Featured</label>
                        <div
                            className={`relative w-12 h-6 cursor-pointer transition duration-200 ease-linear rounded-full ${form.featured ? "bg-green-500" : "bg-gray-300"
                                }`}
                            onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
                        >
                            <span
                                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${form.featured ? "translate-x-6" : "translate-x-0"
                                    }`}
                            />
                        </div>
                        <span className="text-sm text-gray-500">Show on home page if enabled</span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Category & Subcategory */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Category</option>
                            {Category.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Subcategory</label>
                        <select
                            name="product_category"
                            value={form.product_category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Subcategory</option>
                            {Subcategory.map((item) => {
                                return (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                )
                            })}
                        </select>
                        {errors.Subcategory && <p className="text-red-500 text-sm">{errors.Subcategory}</p>}
                    </div>
                </div>

                {/* Image upload */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Main Image</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:shadow-md transition-all w-32 h-32">
                        {form.image ? (
                            <img
                                src={URL.createObjectURL(form.image)}
                                alt="Main Preview"
                                className="w-full h-full object-cover rounded-md shadow"
                            />
                        ) : (
                            <p className="text-gray-400 text-center">Click to upload main image</p>
                        )}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Related Images */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Related Images (max 5)</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-2 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all min-h-[100px]">
                        {form.relatedImage.length > 0 ? (
                            form.relatedImage.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`Related ${idx + 1}`}
                                        className="w-24 h-24 object-cover rounded-md shadow cursor-pointer"
                                    />
                                    {/* Delete icon */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // **ye bahut important hai** ✅
                                            setForm((prev) => {
                                                const newArr = [...prev.relatedImage];
                                                newArr.splice(idx, 1);
                                                setRelatedImageCount(newArr.length);
                                                return { ...prev, relatedImage: newArr };
                                            });
                                        }}
                                        className="absolute top-1 right-1 cursor-pointer bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 w-full text-center">Click to upload related images</p>
                        )}
                        <input
                            type="file"
                            name="relatedImage"
                            accept="image/*"
                            multiple
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                    {relatedImageCount > 5 && (
                        <p className="text-red-500 text-sm mt-1">Maximum 5 images allowed</p>
                    )}
                </div>
                {/* Submit */}
                <div>
                    <LoadingButton loading={loading} name={"Add Product"}></LoadingButton>
                </div>
            </form>
        </Card>
    );
}

export default Add;
