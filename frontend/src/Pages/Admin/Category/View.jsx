import React, { useContext, useEffect, useState } from 'react'
import Bradcrumbs from '../../../Components/Admin/Bradcrumbs'
import { MainContext } from "../../../ContextMain"
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios"
import { Link } from 'react-router-dom';
import Card from '../../../Components/Admin/Card';


function View() {
    const { fectchCategory, Category, BACKEND_URL, CategoryBaseUrl, notify } = useContext(MainContext);
    const [addModalOpen, setAddModalOpen] = useState(false);


    useEffect(
        () => {
            fectchCategory()
        }, [])


    const Bradcrumb = [
        {
            name: "Category",
            path: "/admin/category/view"
        },
        {
            name: "View",
            path: "/admin/category/View"
        }
    ]


    const delDeta = (cId) => {
        axios.delete(BACKEND_URL + CategoryBaseUrl + "/delete" + "/" + cId, {
            withCredentials: true
        })
            .then((success) => {
                console.log(success)
                notify(success.data.message, "success")
                fectchCategory()

            }).catch((err) => {
                notify(err.response.data.message, "error")
            })
    }

    const changeStatus = (id, status) => {
        axios.patch(BACKEND_URL + CategoryBaseUrl + "/change-status/" + id + "/" + status, {}, {
            withCredentials: true
        })
            .then((success) => {
                fectchCategory()
                notify(success.data.message, "success")
            }).catch((err) => {
                notify(err.response.data.message, "error")
            })
    }

    // Helper to convert title -> slug (shared with modal/editor)
    const titleToSlug = (title) => {
        if (!title) return '';
        return title
            .toString()
            .normalize('NFKD')
            .replace(/\s+/g, '-')
            .replace(/[^A-Za-z0-9\-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase();
    };

    // Inline editor state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editSlug, setEditSlug] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    const openEditor = (cat) => {
        setEditingId(cat._id);
        setEditName(cat.name || '');
        setEditSlug(titleToSlug(cat.name || ''));
    };

    const closeEditor = () => {
        setEditingId(null);
        setEditName('');
        setEditSlug('');
        setEditLoading(false);
    };

    const handleEditSubmit = async (e, id) => {
        e.preventDefault();
        if (!editName) return notify('Name is required', 'error');
        try {
            setEditLoading(true);
            const payload = { name: editName, slug: editSlug };
            const res = await axios.put(BACKEND_URL + CategoryBaseUrl + '/update/' + id, payload, {
                withCredentials: true,
            });
            notify(res.data.message || 'Category updated', 'success');
            fectchCategory();

            closeEditor();

        } catch (err) {
            const msg = err?.response?.data?.message || err.message || 'Update failed';
            notify(msg, 'error');
        } finally {
            setEditLoading(false);
        }
    };


    // Inline add category modal content
    const AddCategoryModalContent = ({ onSuccess }) => {
        const { BACKEND_URL, CategoryBaseUrl, notify } = useContext(MainContext);
        const [name, setName] = useState('');
        const [slug, setSlug] = useState('');
        const [loading, setLoading] = useState(false);

        const titleToSlug = (title) => {
            if (!title) return '';
            return title
                .toString()
                .normalize('NFKD')
                .replace(/\s+/g, '-')
                .replace(/[^A-Za-z0-9\-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .toLowerCase();
        };

        const handleNameChange = (e) => {
            const v = e.target.value;
            setName(v);
            setSlug(titleToSlug(v));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!name) return notify('Name is required', 'error');
            try {
                setLoading(true);
                const data = {
                    name: e.target.category.value,
                    slug: e.target.slug.value
                }

                const res = await axios.post(BACKEND_URL + CategoryBaseUrl + '/create', data, {
                    withCredentials: true,
                });

                notify(res.data.message || 'Category created', 'success');
                setName('');
                setSlug('');
                onSuccess && onSuccess();
            } catch (err) {
                const msg = err?.response?.data?.message || err.message || 'Create failed';
                notify(msg, 'error');
            } finally {
                setLoading(false);
            }
        };





        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        placeholder="Enter category name"
                        required
                        name='category'
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Slug (readonly)</label>
                    <input
                        type="text"
                        value={slug}
                        readOnly
                        className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5"
                        placeholder="slug"
                        name='slug'
                    />
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                        {loading ? 'Saving...' : 'Submit'}
                    </button>
                </div>
            </form>
        );
    };
    return (
        <Card>
            <Bradcrumbs Bradcrumb={Bradcrumb} />
            {/* Header with Add Category button */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-semibold">All Categories</h2>
                <button
                    className="px-4 cursor-pointer py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    onClick={() => setAddModalOpen(true)}
                >
                    + Add Category
                </button>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Sr
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Slug
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Category?.map((cat, i) => {
                                return (
                                    <React.Fragment key={cat._id}>
                                        <tr className="bg-white border-b text-black">
                                            <th scope="col" className="px-6 py-3"> {i + 1}</th>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                {cat.name}
                                            </th>
                                            <td className="px-6 py-4">{cat.slug}</td>

                                            <td className="px-6 py-4">
                                                {
                                                    cat.status
                                                        ?
                                                        <span className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-green-400 rounded-full text-white" onClick={() => { changeStatus(cat._id, false) }}>Active</span>
                                                        :
                                                        <span className="inline-block px-3 py-1 text-xs font-semibold cursor-pointer bg-red-400 rounded-full text-white" onClick={() => { changeStatus(cat._id, true) }}>Inactive</span>

                                                }
                                            </td>
                                            <td className="px-6 py-4 text-xl flex gap-4 mt-2">
                                                <MdDeleteOutline className='cursor-pointer hover:text-red-500' onClick={() => delDeta(cat._id)} />
                                                <button type="button" onClick={() => openEditor(cat)} className="text-xl">
                                                    <MdOutlineEdit className='cursor-pointer hover:text-blue-500' />
                                                </button>
                                            </td>
                                        </tr>

                                        {editingId === cat._id && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={5} className="px-6 py-4">
                                                    <form onSubmit={(e) => handleEditSubmit(e, cat._id)} className="flex flex-col md:flex-row gap-3 items-end">
                                                        <div className="flex-1">
                                                            <label className="block mb-1 text-sm font-medium text-gray-900">Name</label>
                                                            <input
                                                                type="text"
                                                                value={editName}
                                                                onChange={(e) => { setEditName(e.target.value); setEditSlug(titleToSlug(e.target.value)); }}
                                                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                                placeholder="Category name"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="w-64">
                                                            <label className="block mb-1 text-sm font-medium text-gray-900">Slug</label>
                                                            <input type="text" value={editSlug} readOnly className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5" />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button type="submit" disabled={editLoading} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition cursor-pointer">{editLoading ? 'Updating...' : 'Update'}</button>
                                                            <button type="button" onClick={closeEditor} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>

            {/* Modal for Add Category */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative">
                        <button
                            onClick={() => setAddModalOpen(false)}
                            className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-red-500 cursor-pointer"
                        >✕</button>
                        <AddCategoryModalContent onSuccess={() => { setAddModalOpen(false); fectchCategory(); }} />
                    </div>
                </div>
            )}
        </Card>
    )
}




export default View
