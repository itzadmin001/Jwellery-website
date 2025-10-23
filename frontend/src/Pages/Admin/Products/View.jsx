import React, { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "../../../ContextMain";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiExport } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiImport } from "react-icons/ci";




function View() {

    const { fetchProduct, BACKEND_URL, ProductBaseUrl, Category } = useContext(MainContext)
    const [Products, SetProduct] = useState([])
    const [limit, Setlimit] = useState(20);
    const [query, setQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState(undefined);
    const [actionOpen, setActionOpen] = useState(null);
    const actionRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("view") // 'view' or 'edit'
    const [modalProductId, setModalProductId] = useState(null)
    const [modalProduct, setModalProduct] = useState(null)
    const [modalLoading, setModalLoading] = useState(false)

    // import popover state
    const [importOpen, setImportOpen] = useState(false)
    const [importFile, setImportFile] = useState(null)
    const [importLoading, setImportLoading] = useState(false)
    const [importError, setImportError] = useState('')
    const importRef = useRef(null)
    // export modal state
    const [exportOpen, setExportOpen] = useState(false)
    const [exportSelected, setExportSelected] = useState(new Set())
    const [exportSelectAll, setExportSelectAll] = useState(false)



    const navigate = useNavigate()


    const getProduct = () => {
        fetchProduct({ limit })
            .then((success) => {
                SetProduct(success.data)
            }).catch((err) => {
                console.log(err)
            })
    }



    useEffect(() => {
        getProduct()
    }, [limit])

    useEffect(() => {
        if (filterCategory == "ALL") {
            getProduct()
        } else {
            axios.get(`${BACKEND_URL}${ProductBaseUrl}/get-all`, {
                params: { categoryId: filterCategory },
                withCredentials: true,
            }).then((success) => {
                SetProduct(success.data.FindAllProduct)
            }).catch((err) => {
                console.log(err)
            })
        }

    }, [filterCategory])

    // close dropdown when clicking outside
    useEffect(() => {
        const onDoc = (e) => {
            if (actionRef.current && !actionRef.current.contains(e.target)) {
                setActionOpen(null)
            }
        }
        document.addEventListener("click", onDoc)
        return () => document.removeEventListener("click", onDoc)
    }, [])

    // close import popover when clicking outside
    useEffect(() => {
        const onDoc = (e) => {
            if (importRef.current && !importRef.current.contains(e.target) && e.target) {
                // if click was outside the popover and not on the import button, close
                setImportOpen(false)
            }
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [])

    // submit import file to backend as field name 'excel'
    const handleImportSubmit = async () => {
        setImportError('')
        if (!importFile) {
            setImportError('Please select a file to import')
            return
        }
        const fd = new FormData()
        fd.append('excel', importFile)
        try {
            setImportLoading(true)
            const res = await axios.post(`${BACKEND_URL}${ProductBaseUrl}/add-product-excel`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
            // assume success -> refresh list and close
            console.log('Import success', res)
            getProduct()
            setImportOpen(false)
            setImportFile(null)
        } catch (err) {
            console.log('Import failed', err)
            const msg = err?.response?.data?.message || err.message || 'Upload failed'
            setImportError(msg)
        } finally {
            setImportLoading(false)
        }
    }

    // Export selected products to CSV and trigger download
    const downloadCSV = (rows, filename = 'products_export.csv') => {
        if (!rows || rows.length === 0) return
        const keys = Object.keys(rows[0])
        const csv = [keys.join(',')].concat(rows.map(r => keys.map(k => {
            let v = r[k]
            if (v === null || v === undefined) return ''
            // escape quotes
            v = String(v).replace(/"/g, '""')
            // wrap if contains comma or quote or newline
            if (/[",\n]/.test(v)) return `"${v}"`
            return v
        }).join(',')))
        const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const handleExportSave = () => {
        // build array of selected products
        const selectedIds = Array.from(exportSelected)
        const rows = Products.filter(p => selectedIds.includes(p._id)).map(p => ({
            id: p._id,
            name: p.name || '',
            sku: p.sku || '',
            category: p.category?.name || p.category || '',
            price: p.price ?? '',
            originalPrice: p.originalPrice ?? '',
            description: p.description || '',
            stockQuantity: p.stockQuantity ?? p.stock ?? '',
            status: p.status ? 'Active' : 'Inactive',
            featured: p.featured ? 'Yes' : 'No',
            tags: Array.isArray(p.tags) ? p.tags.join('|') : (p.tags || ''),
        }))
        if (rows.length === 0) {
            alert('No products selected for export')
            return
        }
        downloadCSV(rows, 'products_export.csv')
        setExportOpen(false)
        setExportSelected(new Set())
        setExportSelectAll(false)
    }

    const toggleExportSelect = (id) => {
        setExportSelected(prev => {
            const s = new Set(prev)
            if (s.has(id)) s.delete(id)
            else s.add(id)
            setExportSelectAll(s.size === Products.length)
            return s
        })
    }

    const handleSelectAllToggle = () => {
        if (exportSelectAll) {
            setExportSelected(new Set())
            setExportSelectAll(false)
        } else {
            setExportSelected(new Set(Products.map(p => p._id)))
            setExportSelectAll(true)
        }
    }



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

    // modal helpers
    const openModalWithId = (id) => {
        setModalProduct(null)
        setModalProductId(id)
        setModalOpen(true)
        setModalLoading(true)
        axios.get(`${BACKEND_URL}${ProductBaseUrl}/get`, { params: { id }, withCredentials: true })
            .then(res => {
                const p = res.data.data || res.data
                setModalProduct(p)
            }).catch(err => console.log(err))
            .finally(() => setModalLoading(false))
    }

    const closeModal = () => {
        setModalOpen(false)
        setModalProductId(null)
        setModalProduct(null)
        setModalMode('view')
        setActionOpen(null)
    }

    const saveModalProduct = async (form) => {
        if (!modalProductId) return;
        const formData = new FormData();
        formData.append('name', form.name || '')
        formData.append('slug', form.slug || '')
        formData.append('price', form.price?.toString() || '')
        formData.append('originalPrice', form.originalPrice?.toString() || '')
        formData.append('description', form.description || '')
        formData.append('category', form.category || '')
        formData.append('sku', form.sku || '')
        formData.append('stockQuantity', form.stockQuantity?.toString() || '')
        formData.append('status', form.status ? 'true' : 'false')
        formData.append('stock', form.stock ? 'true' : 'false')
        formData.append('featured', form.featured ? 'true' : 'false')
        formData.append('metaTitle', form.metaTitle || '')
        formData.append('metaDescription', form.metaDescription || '')

        // arrays
        if (form.tags) formData.append('tags', JSON.stringify(form.tags))
        if (form.features) formData.append('features', JSON.stringify(form.features))
        if (form.existingRelated) formData.append('existingRelated', JSON.stringify(form.existingRelated))

        if (form.mainImage && form.mainImage instanceof File) {
            formData.append('image', form.mainImage)
        }
        if (Array.isArray(form.relatedFiles) && form.relatedFiles.length > 0) {
            form.relatedFiles.forEach(f => formData.append('relatedImage', f))
        }

        try {
            await axios.put(`${BACKEND_URL}${ProductBaseUrl}/update/${modalProductId}`, formData, { withCredentials: true })
            // refresh list and close
            getProduct()
            closeModal()
        } catch (err) {
            console.log('Save failed', err)
        }
    }





    return (
        <div className=" min-h-screen bg-gray-50">
            <div className="max-w-full mx-auto">
                <div className="flex flex-wrap items-center justify-between mb-6 p-4 gap-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
                    <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products by name or SKU..."
                            className="flex-grow min-w-[200px] px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-black/20"
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 border rounded bg-white cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {

                                Category.map((item, index) => {
                                    return (
                                        <option className=" cursor-pointer" key={index} value={item._id}>{item.name}</option>
                                    )
                                })
                            }

                            {/* map categories here */}
                        </select>
                        <button onClick={() => setExportOpen(true)} className="px-3  flex items-center gap-2 cursor-pointer py-2 bg-white border rounded hover:bg-gray-100 transition">
                            <span className="font-bold"><CiExport /></span>
                            Export
                        </button>
                        {/* Import button + popover */}
                        <div className="relative" ref={importRef}>
                            <label onClick={() => setImportOpen(o => !o)} className="px-3 py-2 flex items-center gap-2 cursor-pointer bg-white border rounded hover:bg-gray-100 transition">
                                <CiImport className="text-lg" />
                                <span className="">Import</span>
                            </label>

                            {/* Popover */}
                            {importOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-sm border z-50 p-3">
                                    <div className="text-sm font-medium mb-2">Import products (Excel / CSV)</div>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                                        className="w-full  cursor-pointer hover:bg-gray-100 transition px-2 py-1 border rounded "
                                    />
                                    {importError && <div className="text-sm text-red-600 mt-2">{importError}</div>}
                                    <div className="mt-3 flex justify-end gap-2">
                                        <button onClick={() => { setImportOpen(false); setImportFile(null); setImportError('') }} className="px-3 cursor-pointer  py-1 border rounded">Cancel</button>
                                        <button onClick={handleImportSubmit} disabled={importLoading} className="px-3 py-1 bg-black text-white cursor-pointer rounded disabled:opacity-50">{importLoading ? 'Uploading...' : 'Submit'}</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => navigate("/admin/product/add")} className="px-3 py-2  bg-black text-white rounded-md cursor-pointer hover:bg-black/80 transition">
                            + Add Product
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden" ref={actionRef}>
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="text-sm text-gray-600">Showing {Products.length} products</div>
                        <div className="text-sm text-gray-500">Load: {limit}</div>
                    </div>

                    <div className="mb-20">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gradient-to-r from-gray-900 to-black text-white">
                                <tr>
                                    <th className="px-2 py-3 text-left text-sm font-medium">Product</th>
                                    <th className="px-2 py-3 text-left text-sm font-medium">SKU</th>
                                    <th className="px-2 py-3 text-left text-sm font-medium">Category</th>
                                    <th className="px-2 py-3 text-left text-sm font-medium">Price</th>
                                    <th className=" px-2 py-3 text-left text-sm font-medium">Stock Quantity</th>
                                    <th className="px-2 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-2 py-3 text-left text-sm font-medium">Featured</th>
                                    <th className="px-2 py-3 text-center text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y ">
                                {Products.length > 0 ? (
                                    Products.filter(p => {
                                        if (!query) return true;
                                        const q = query.toLowerCase();
                                        return (p.name || "").toLowerCase().includes(q) || (p.sku || "").toString().includes(q) || (p.slug || "").toLowerCase().includes(q)
                                    }).map((p, idx) => (
                                        <tr key={p._id} className="hover:bg-gray-50">
                                            <td className="px-2 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded overflow-hidden border flex-shrink-0">
                                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-gray-800 truncate cursor-pointer" onClick={() => navigate(`/admin/product/view/${p._id}`)}>{p.name}</div>
                                                        <div className="text-sm text-gray-500 truncate">{p.description ? p.description.substring(0, 80) + (p.description.length > 80 ? "..." : "") : "—"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-4 text-sm text-gray-600">{p.sku || "—"}</td>
                                            <td className="px-2 py-4 text-sm text-gray-700">{p.category?.name || "-"}</td>
                                            <td className="px-2 py-4 text-sm text-gray-700">₹{Number(p.price).toLocaleString("en-IN")}</td>
                                            <td className=" px-6 py-4 text-sm ">
                                                <li className="inline-block px-4 py-1 text-xs font-semibold bg-black rounded-full text-white">{p.stockQuantity ?? p.stock ?? 0}</li>
                                            </td>
                                            <td className="px-2 py-4">
                                                {p.status ? (
                                                    <button onClick={() => toggleBoolean(p._id, "status", false)} className="inline-block cursor-pointer px-3 py-1 text-xs font-semibold bg-green-600 rounded-full text-white">Active</button>
                                                ) : (
                                                    <button onClick={() => toggleBoolean(p._id, "status", true)} className="inline-block cursor-pointer px-3 py-1 text-xs font-semibold bg-red-500 rounded-full text-white">Inactive</button>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {p.featured ? (
                                                    <button onClick={() => toggleBoolean(p._id, "featured", false)} className="inline-block cursor-pointer px-3 py-1 text-xs font-semibold bg-black rounded-full text-white">Yes</button>
                                                ) : (
                                                    <button onClick={() => toggleBoolean(p._id, "featured", true)} className="inline-block cursor-pointer px-3 py-1 text-xs font-semibold bg-black rounded-full text-white">No</button>
                                                )}
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <div className="inline-block relative">
                                                    <button onClick={(e) => { e.stopPropagation(); setActionOpen(actionOpen === p._id ? null : p._id) }} className="px-3 py-1 text-lg cursor-pointer rounded">...</button>
                                                    {actionOpen === p._id && (
                                                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-sm border z-50">
                                                            <button onClick={() => { setModalMode('view'); openModalWithId(p._id); }} className="w-full cursor-pointer flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50">
                                                                <span><GrView /></span>
                                                                View</button>
                                                            <button onClick={() => { setModalMode('edit'); openModalWithId(p._id); }} className="w-full flex cursor-pointer items-center gap-2 text-left px-4 py-2 hover:bg-gray-50">
                                                                <span><FaEdit /></span>
                                                                Edit</button>

                                                            <button onClick={() => removeProduct(p._id)} className="w-full flex cursor-pointer items-center gap-2 text-left px-4 py-2 text-red-600 hover:bg-gray-50">
                                                                <span><MdDelete /></span>
                                                                Delete</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="p-6 text-center text-gray-500">No products to show</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 text-center" onClick={() => Setlimit(limit + 10)}>
                        <button className=" bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 sm:px-6 px-4 py-2 rounded-md text-white cursor-pointer">Load More</button>
                    </div>
                </div>
                {/* Modal overlay for View / Edit */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-4xl p-4 relative max-h-[80vh] overflow-hidden">
                            <button onClick={closeModal} className="absolute right-10 top-5 font-bold cursor-pointer hover:text-red-400 text-gray-600">✕</button>
                            <div className="overflow-y-auto max-h-[72vh] pr-2">
                                {modalLoading ? (
                                    <div className="p-6 text-center">Loading...</div>
                                ) : (!modalProduct) ? (
                                    <div className="p-6 text-center text-gray-500">Product not found</div>
                                ) : modalMode === 'view' ? (
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-1">
                                            <div className="w-40 h-40 border rounded overflow-hidden">
                                                <img src={modalProduct.image} alt={modalProduct.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="mt-4">
                                                <h4 className="font-semibold">Related Images</h4>
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    {Array.isArray(modalProduct.relatedImage) && modalProduct.relatedImage.length > 0 ? modalProduct.relatedImage.map((r, i) => (
                                                        <div key={i} className="w-16 h-16 border rounded overflow-hidden">
                                                            <img src={r} alt={`rel-${i}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    )) : <div className="text-sm text-gray-500">No images</div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <h3 className="text-2xl font-semibold">{modalProduct.name}</h3>
                                            <p className="text-sm text-gray-600 mt-2">{modalProduct.description || '—'}</p>

                                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                                                <div>
                                                    <div className="font-medium">SKU</div>
                                                    <div>{modalProduct.sku || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Original Price</div>
                                                    <div>₹{Number(modalProduct.originalPrice || modalProduct.price || 0).toLocaleString('en-IN')}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Price</div>
                                                    <div>₹{Number(modalProduct.price || 0).toLocaleString('en-IN')}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Category</div>
                                                    <div>{modalProduct.category?.name || modalProduct.category || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Stock Quantity</div>
                                                    <div>{modalProduct.stockQuantity ?? (modalProduct.stock ? 'Available' : 'Out')}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Status</div>
                                                    <div>{modalProduct.status ? 'Active' : 'Inactive'}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Featured</div>
                                                    <div>{modalProduct.featured ? 'Yes' : 'No'}</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">Material / Weight</div>
                                                    <div>{modalProduct.material || modalProduct.weight || '-'}</div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="font-medium">Tags</div>
                                                    <div className="flex gap-2 mt-1 flex-wrap">
                                                        {Array.isArray(modalProduct.tags) ? modalProduct.tags.map((t, i) => <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{t}</span>) : '-'}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 mt-2">
                                                    <div className="font-medium">Meta Title</div>
                                                    <div className="text-sm text-gray-700">{modalProduct.metaTitle || '-'}</div>
                                                    <div className="font-medium mt-2">Meta Description</div>
                                                    <div className="text-sm text-gray-700">{modalProduct.metaDescription || '-'}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-3 justify-end">
                                                <button onClick={closeModal} className="px-4 cursor-pointer py-2 border rounded">Close</button>
                                                <button onClick={() => { setModalMode('edit') }} className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <FullEditForm product={modalProduct} onCancel={closeModal} onSave={saveModalProduct} Category={Category} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Export modal */}
                {exportOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-3xl p-4 relative max-h-[80vh] overflow-auto">
                            <button onClick={() => setExportOpen(false)} className="absolute right-6 top-4 font-bold cursor-pointer hover:text-red-400 text-gray-600">✕</button>
                            <h3 className="text-lg font-semibold mb-3">Export Products</h3>
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm text-gray-600">Select products to export</div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <label className="text-sm">Select All</label>
                                    <input type="checkbox" checked={exportSelectAll} onChange={handleSelectAllToggle} />
                                </div>
                            </div>
                            <div className="border rounded p-2 max-h-72 overflow-auto">
                                {Products.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">No products available</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {Products.map(p => (
                                            <li key={p._id} className="flex items-center justify-between p-2 border-b">
                                                <div className="flex items-center gap-3">
                                                    <input type="checkbox" className=" cursor-pointer" checked={exportSelected.has(p._id)} onChange={() => toggleExportSelect(p._id)} />
                                                    <div className="w-10 h-10 rounded overflow-hidden border flex-shrink-0">
                                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{p.name}</div>
                                                        <div className="text-sm text-gray-500">SKU: {p.sku || '—'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">₹{Number(p.price || 0).toLocaleString('en-IN')}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button onClick={() => { setExportOpen(false); setExportSelected(new Set()); setExportSelectAll(false) }} className="px-4 py-2 border rounded">Cancel</button>
                                <button onClick={handleExportSave} className="px-4 py-2 bg-green-600 text-white rounded">Save & Download</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}






function FullEditForm({ product, onCancel, onSave, Category = [] }) {
    const [form, setForm] = useState({
        name: product.name || '',
        slug: product.slug || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || product.price || 0,
        description: product.description || '',
        category: product.category?._id || product.category || '',
        // subcategory removed per request
        sku: product.sku || '',
        stockQuantity: product.stockQuantity || product.stock || 0,
        featured: !!product.featured,
        status: !!product.status,
        stock: !!product.stock,
        tags: Array.isArray(product.tags) ? product.tags.slice() : [],
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        features: Array.isArray(product.features) ? product.features.slice() : [],
        mainImage: null,
        relatedFiles: []
    })

    const [existingRelated, setExistingRelated] = useState(Array.isArray(product.relatedImage) ? product.relatedImage.slice() : [])

    const handle = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') return setForm(s => ({ ...s, [name]: checked }))
        setForm(s => ({ ...s, [name]: value }))
    }

    const handleMainImage = (e) => {
        const f = e.target.files?.[0]
        if (f) setForm(s => ({ ...s, mainImage: f }))
    }

    const handleRelated = (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length) setForm(s => ({ ...s, relatedFiles: [...s.relatedFiles, ...files] }))
    }

    const removeExistingRelated = (i) => {
        setExistingRelated(arr => arr.filter((_, idx) => idx !== i))
    }

    const removeNewRelated = (i) => {
        setForm(s => ({ ...s, relatedFiles: s.relatedFiles.filter((_, idx) => idx !== i) }))
    }

    const addTag = (t) => {
        if (!t) return
        setForm(s => ({ ...s, tags: [...s.tags, t] }))
    }

    const submit = () => {
        const payload = { ...form, relatedFiles: form.relatedFiles, tags: form.tags }
        // include existing related images as array so backend may keep them
        payload.existingRelated = existingRelated
        onSave(payload)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold">Images</h3>
                <div className="mt-2">
                    <div className="w-36 h-36 border rounded overflow-hidden">
                        <img src={form.mainImage ? URL.createObjectURL(form.mainImage) : product.image} alt="main" className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-2">
                        <input type="file" accept="image/*" onChange={handleMainImage} />
                    </div>
                    <div className="mt-4">
                        <div className="font-medium">Existing Related</div>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {existingRelated.map((r, i) => (
                                <div key={i} className="relative w-16 h-16 border rounded overflow-hidden">
                                    <img src={r} alt={`r-${i}`} className="w-full h-full object-cover" />
                                    <button onClick={() => removeExistingRelated(i)} className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <div className="font-medium">Add Related Images</div>
                            <input type="file" accept="image/*" multiple onChange={handleRelated} />
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {form.relatedFiles.map((f, i) => (
                                    <div key={i} className="relative w-16 h-16 border rounded overflow-hidden">
                                        <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                                        <button onClick={() => removeNewRelated(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Details</h3>
                <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm">Name</label>
                            <input name="name" value={form.name} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm">SKU</label>
                            <input name="sku" value={form.sku} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm">Price</label>
                            <input name="price" type="number" value={form.price} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm">Original Price</label>
                            <input name="originalPrice" type="number" value={form.originalPrice} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <label className="block text-sm">Category</label>
                            <select name="category" value={form.category} onChange={handle} className="mt-1 w-full border rounded px-3 py-2">
                                <option value="">-- Select --</option>
                                {Category.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm">Stock Quantity</label>
                            <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm">Tags (comma)</label>
                            <input name="tagsInput" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(e.target.value); e.target.value = '' } }} className="mt-1 w-full border rounded px-3 py-2" placeholder="Type tag and press Enter" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm">Description</label>
                        <textarea name="description" value={form.description} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" rows={4} />
                    </div>
                    <div>
                        <label className="block text-sm">Tags (comma separated)</label>
                        <input name="tagsInput" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(e.target.value); e.target.value = '' } }} className="mt-1 w-full border rounded px-3 py-2" placeholder="Type tag and press Enter" />
                        <div className="mt-2 flex gap-2 flex-wrap">
                            {form.tags.map((t, i) => <span key={i} className="px-2 py-1 bg-gray-100 rounded">{t}</span>)}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm">Meta Title</label>
                        <input name="metaTitle" value={form.metaTitle} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm">Meta Description</label>
                        <textarea name="metaDescription" value={form.metaDescription} onChange={handle} className="mt-1 w-full border rounded px-3 py-2" rows={2} />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={onCancel} className="px-4 cursor-pointer py-2 border rounded">Cancel</button>
                        <button onClick={submit} className="px-4 cursor-pointer py-2 bg-green-600 hover:bg-green-400 text-white rounded">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default View;
