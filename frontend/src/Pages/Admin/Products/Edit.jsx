import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../ContextMain";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Edit() {
    const { BACKEND_URL, ProductBaseUrl, Subcategory, Category } = useContext(MainContext);
    const { id } = useParams();
    const navigate = useNavigate();

    // form state
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        price: "",
        description: "",
        category: "", // assume category id
        subcategory: "", // assume subcategory id
        featured: false,
        status: false,
        stock: false,
        sale: false,
    });

    // image files chosen by admin
    const [mainImageFile, setMainImageFile] = useState(null);

    const [relatedFiles, setRelatedFiles] = useState([]); // File[]
    // previews / existing urls
    const [existingMainImage, setExistingMainImage] = useState(""); // url
    const [existingRelatedImages, setExistingRelatedImages] = useState([]); // url[]

    // fetch product by id on mount
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        // Assumed endpoint - change if your backend is different
        axios
            .get(`${BACKEND_URL}${ProductBaseUrl}/get`, {
                params: { id },
                withCredentials: true
            })
            .then((res) => {
                const p = res.data.data;
                setForm({
                    name: p.name || "",
                    slug: p.slug || "",
                    price: p.price || "",
                    description: p.description || "",
                    category: p.category?._id || (p.category || ""),
                    subcategory: p.subcategory?._id || (p.subcategory || ""),
                    featured: !!p.featured,
                    status: !!p.status,
                    stock: !!p.stock,
                    sale: !!p.sale,
                });

                setExistingMainImage(p.image || "");
                setExistingRelatedImages(Array.isArray(p.relatedImage) ? [...p.relatedImage] : []);
            })
            .catch((err) => {
                console.error("Failed to fetch product:", err);
                // optionally show toast
            })
            .finally(() => setLoading(false));
    }, [id, BACKEND_URL, ProductBaseUrl]);

    // handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setForm((s) => ({ ...s, [name]: checked }));
            return;
        }

        // If the admin is editing the product name, also update the slug in real-time
        if (name === "name") {
            const newName = value;
            const newSlug = slugify(newName);
            setForm((s) => ({ ...s, name: newName, slug: newSlug }));
            return;
        }

        setForm((s) => ({ ...s, [name]: value }));
    };
    function slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");
    }

    const handleMainImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainImageFile(file);
            // update preview by showing object URL
            setExistingMainImage(URL.createObjectURL(file));
        }
    };

    const handleRelatedFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        // append to existing selection
        setRelatedFiles((prev) => [...prev, ...files]);
    };

    // remove an existing related image url locally (so backend will drop it)
    const removeExistingRelatedImage = (idx) => {
        setExistingRelatedImages((arr) => arr.filter((_, i) => i !== idx));
    };

    // remove a selected new related file (by index in relatedFiles)
    const removeSelectedRelatedFile = (idx) => {
        setRelatedFiles((arr) => {
            // revoke objectURL if any created
            // (we created only for mainImage preview; not creating for relatedFiles here)
            return arr.filter((_, i) => i !== idx);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            // basic fields (controller expects these names)
            formData.append("name", form.name);
            formData.append("slug", form.slug);
            formData.append("price", form.price?.toString() ?? "");
            formData.append("category", form.category); // category id
            // backend expects product_category for subcategory
            formData.append("product_category", form.subcategory);
            // booleans — send as strings so req.body has them
            formData.append("status", form.status ? "true" : "false");
            formData.append("stock", form.stock ? "true" : "false");
            formData.append("sale", form.sale ? "true" : "false");

            // optional: send description if you want it updated
            if (form.description !== undefined) formData.append("description", form.description);

            // Main image: append under field name "image" (matches upload.fields)
            if (mainImageFile) {
                formData.append("image", mainImageFile); // single file
            }

            // Related images: append each file under the SAME field name "relatedImage"
            // (multer upload.fields will populate req.files.relatedImage as an array)
            relatedFiles.forEach((f) => {
                formData.append("relatedImage", f);
            });

            // NOTE: your controller doesn't currently read existingRelatedImage,
            // so if you remove existing related images on frontend, backend won't know
            // unless you extend the controller. If you want, you can also send the
            // remaining existingRelatedImages as JSON so the backend can handle it:
            // formData.append("existingRelatedImage", JSON.stringify(existingRelatedImages));

            // Send to PUT /update/:id
            const res = await axios.put(
                `${BACKEND_URL}${ProductBaseUrl}/update/${id}`,
                formData,
                {
                    withCredentials: true,
                    // Let the browser set Content-Type with boundary automatically:
                    // DO NOT set Content-Type manually to avoid missing boundary.
                    // headers: { "Content-Type": "multipart/form-data" }, // optional — better omit
                }
            );

            console.log("update response:", res);
            // navigate back or show toast
            // navigate("/admin/product/view");
        } catch (err) {
            console.error("Update failed:", err);
        } finally {
            setLoading(false);
            navigate("/admin/product/view")
        }
    };

    if (loading && !product) {
        return (
            <div className="p-6">
                <p>Loading product...</p>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className=" mx-auto bg-white rounded shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Slug (read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug (read-only)</label>
                        <input
                            name="slug"
                            value={form.slug}
                            readOnly
                            className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Category & Subcategory (simple inputs; replace with selects if you have lists) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setForm((prev) => ({
                                            ...prev,
                                            category: selectedId,
                                            subcategory: "", // reset subcategory when category changes
                                        }));
                                    }}
                                    className="mt-1 block w-full border rounded px-3 py-2 bg-white"
                                >
                                    <option value="">-- Select Category --</option>
                                    {Category.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                                <select
                                    name="subcategory"
                                    value={form.subcategory}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setForm((prev) => ({ ...prev, subcategory: selectedId }));
                                    }}
                                    className="mt-1 block w-full border rounded px-3 py-2 bg-white"
                                    disabled={!form.category}
                                >
                                    <option value="">-- Select Subcategory --</option>
                                    {Subcategory.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* Booleans */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                            <span className="text-sm">Featured</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
                            <span className="text-sm">Status (Active)</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="stock" checked={form.stock} onChange={handleChange} />
                            <span className="text-sm">Stock (Available)</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="sale" checked={form.sale} onChange={handleChange} />
                            <span className="text-sm">Sale</span>
                        </label>
                    </div>

                    {/* Main Image upload and preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Main Image</label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="w-28 h-28 rounded border overflow-hidden">
                                {existingMainImage ? (
                                    // existingMainImage may be a remote URL or object URL we created if user selected a file
                                    // show it
                                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                    <img src={existingMainImage} alt="main image" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                                )}
                            </div>
                            <div>
                                <input type="file" accept="image/*" onChange={handleMainImageChange} />
                                <p className="text-xs text-gray-500 mt-1">Choose a new image to replace the current one (optional).</p>
                            </div>
                        </div>
                    </div>

                    {/* Related images (existing + new upload) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Related Images</label>

                        <div className="mt-2 space-y-2">
                            {/* existing urls with remove */}
                            {existingRelatedImages.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {existingRelatedImages.map((url, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={url} alt={`related-${idx}`} className="w-20 h-20 object-cover rounded border" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingRelatedImage(idx)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* previews for newly-selected related files */}
                            {relatedFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {relatedFiles.map((f, idx) => {
                                        const preview = URL.createObjectURL(f);
                                        return (
                                            <div key={idx} className="relative">
                                                <img src={preview} alt={f.name} className="w-20 h-20 object-cover rounded border" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedRelatedFile(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                                                    title="Remove"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="mt-1">
                                <input type="file" accept="image/*" multiple onChange={handleRelatedFilesChange} />
                                <p className="text-xs text-gray-500 mt-1">You can add multiple related images. Removing an existing image will keep it deleted on submit.</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/product/view")}
                            className="px-4 py-2 rounded border text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Edit;
