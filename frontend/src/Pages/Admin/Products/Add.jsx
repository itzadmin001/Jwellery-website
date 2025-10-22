import React, { useState, useEffect, useContext } from "react";
import Card from "../../../Components/Admin/Card";
import LoadingButton from "../../../Components/Admin/LoadingButton";
import axios from "axios";
import { MainContext } from "../../../ContextMain";
import { useNavigate } from "react-router-dom";

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
    const [loading, Setloading] = useState(false)
    const { Category, BACKEND_URL, ProductBaseUrl, notify } = useContext(MainContext)
    const [form, setForm] = useState({
        name: "",
        slug: "",
        price: "",
        originalPrice: "",
        stock: true,
        sale: false,
        featured: false,
        description: "",
        category: "",
        collection: "",
        material: "",
        weight: "",
        dimensions: "",
        sku: "",
        stockQuantity: 0,
        features: [],
        image: "",
        relatedImage: [],
        certifications: [],
        tags: [],
        metaTitle: "",
        metaDescription: "",
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    // Generate slug in real-time
    useEffect(() => {
        setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }, [form.name]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Helpers for chip-style inputs (features/certifications/tags)
    const handleAddChip = (name, value) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        setForm((prev) => ({ ...prev, [name]: [...prev[name], trimmed] }));
    };

    const handleRemoveChip = (name, idx) => {
        setForm((prev) => ({ ...prev, [name]: prev[name].filter((_, i) => i !== idx) }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name) errs.name = "Name is required";
        if (!form.price) errs.price = "Price is required";
        if (!form.category) errs.category = "Category is required";
        if (!form.sku) errs.sku = "SKU is required";
        if (!form.image) errs.image = "Product image URL is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        Setloading(true);

        try {
            // For this task we just print the final data to console
            // Ensure relatedImage is array of URLs and image is single URL string
            const payload = {
                ...form,
                // trim strings
                name: form.name.trim(),
                slug: form.slug.trim(),
                price: form.price,
                originalPrice: form.originalPrice,
                category: form.category.trim(),
                image: form.image.trim(),
                relatedImage: form.relatedImage.map((u) => u.trim()).filter(Boolean),
            };

            console.log("Submitting product:", payload);

            axios.post(BACKEND_URL + ProductBaseUrl + "/create", payload, {
                withCredentials: true
            }).then((success) => {
                notify("Product added successfully", "success");
                navigate("/admin/products");
                console.log("✅ Product added successfully:", success);
            }).catch((error) => {
                notify(error.response?.data?.message || "Error adding product", "error");
                console.error("❌ Error adding product:", error);
            });

            setForm({
                name: "",
                slug: "",
                price: "",
                originalPrice: "",
                stock: true,
                sale: false,
                featured: false,
                description: "",
                category: "",
                collection: "",
                material: "",
                weight: "",
                dimensions: "",
                sku: "",
                stockQuantity: 0,
                features: [],
                image: "",
                relatedImage: [],
                certifications: [],
                tags: [],
                metaTitle: "",
                metaDescription: "",
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

                {/* Original Price & SKU */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Original Price</label>
                        <input
                            type="number"
                            name="originalPrice"
                            value={form.originalPrice}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                    </div>
                </div>

                {/* Collection, Material, Weight, Dimensions */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Collection</label>
                        <input name="collection" value={form.collection} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Material</label>
                        <input name="material" value={form.material} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Weight</label>
                        <input name="weight" value={form.weight} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Dimensions</label>
                        <input name="dimensions" value={form.dimensions} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                </div>

                {/* Stock Quantity & Features */}
                <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Stock Quantity</label>
                        <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Features</label>
                        <div className="border border-gray-300 rounded px-3 py-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.features.map((f, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-2 text-sm">
                                        {f}
                                        <button type="button" onClick={() => handleRemoveChip('features', idx)} className="ml-1 text-sm font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Type a feature and press Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddChip('features', e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Certifications & Tags */}
                <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Certifications</label>
                        <div className="border border-gray-300 rounded px-3 py-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.certifications.map((f, idx) => (
                                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-2 text-sm">
                                        {f}
                                        <button type="button" onClick={() => handleRemoveChip('certifications', idx)} className="ml-1 text-sm font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Type a certification and press Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddChip('certifications', e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block mb-1 font-medium">Tags</label>
                        <div className="border border-gray-300 rounded px-3 py-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {form.tags.map((f, idx) => (
                                    <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-2 text-sm">
                                        {f}
                                        <button type="button" onClick={() => handleRemoveChip('tags', idx)} className="ml-1 text-sm font-bold">×</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Type a tag and press Enter"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddChip('tags', e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="w-full focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Meta Title & Description */}
                <div className="mt-2">
                    <label className="block mb-1 font-medium">Meta Title</label>
                    <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="mt-2">
                    <label className="block mb-1 font-medium">Meta Description</label>
                    <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
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
                        <label className="block mb-1 font-medium">Category Name</label>
                        <input name="category" value={form.category} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

                    </div>
                </div>

                {/* Image URL input */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Main Image URL</label>
                    <input
                        type="url"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        value={form.image}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {form.image && (
                        <img src={form.image} alt="main" className="mt-2 w-32 h-32 object-cover rounded-md shadow" />
                    )}
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Related Images URLs */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Related Image URLs (press Enter to add)</label>
                    <div className="border border-gray-300 rounded px-3 py-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.relatedImage.map((u, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full flex items-center gap-2 text-sm">
                                    {u}
                                    <button type="button" onClick={() => { handleRemoveChip('relatedImage', idx); }} className="ml-1 text-sm font-bold">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="url"
                            placeholder="https://example.com/related1.jpg"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.target.value.trim();
                                    if (val) {
                                        setForm((prev) => ({ ...prev, relatedImage: [...prev.relatedImage, val] }));
                                        e.target.value = '';
                                    }
                                }
                            }}
                            className="w-full focus:outline-none"
                        />
                    </div>
                    {form.relatedImage.length > 5 && (
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
