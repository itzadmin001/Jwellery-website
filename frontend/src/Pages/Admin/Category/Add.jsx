import React, { useState, useEffect, useContext } from 'react'
import Card from "../../../Components/Admin/Card"
import Bradcrumbs from '../../../Components/Admin/Bradcrumbs'
import LoadingButton from '../../../Components/Admin/LoadingButton'
import axios from 'axios'
import { MainContext } from '../../../ContextMain'

// utility: create slug from text
const createSlug = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
        .replace(/[\s\-]+/g, '-') // collapse spaces and hyphens
        .replace(/^-+|-+$/g, '') // trim hyphens

export default function Add() {
    const { BACKEND_URL, CategoryBaseUrl, notify } = useContext(MainContext)


    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imageName, setImageName] = useState('')
    const [Loading, SetLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [successMsg, setSuccessMsg] = useState('')


    const Bradcrumb = [
        {
            name: "category",
            path: "/admin/category/view"
        },
        {
            name: "add",
            path: "/admin/category/add"
        },
    ]

    // update slug in real-time whenever name changes
    useEffect(() => {
        setSlug(createSlug(name))
    }, [name])

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0]
        setImageFile(file || null)
        setImageName(file ? file.name : '')
    }

    const validate = () => {
        const err = {}
        if (!name.trim()) err.name = 'Category name is required'
        if (!imageName) err.image = 'Please choose an image'
        return err
    }

    const handleSubmit = async (e) => {
        console.log("h")
        e.preventDefault()

        setErrors({})
        setSuccessMsg('')

        const err = validate()
        if (Object.keys(err).length) {
            setErrors(err)
            return
        }
        try {
            const formData = new FormData()
            formData.append('name', name.trim())
            formData.append('slug', slug)
            formData.append("image", imageFile);

            axios.post(BACKEND_URL + CategoryBaseUrl + "/create", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((success) => {
                    notify(success.data.data.message, "success")
                    SetLoading(false)
                }).catch((err) => {
                    SetLoading(false)
                })
            SetLoading(false)
            setSuccessMsg('Category saved successfully')
            setName('')
            setImageFile(null)
            setImageName('')
            setSlug('')
        } catch (error) {
            SetLoading(false)
            setErrors({ submit: error.message })
        } finally {
        }
    }

    return (
        <Card>

            <Bradcrumbs Bradcrumb={Bradcrumb} />
            <div className="w-full px-4 mx-auto mt-5">
                <h2 className="text-2xl font-semibold mb-4">Add Category</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Category Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Men's Clothing"
                            maxLength={30}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                        <p className="text-xs text-gray-500 mt-1">Slug will be generated automatically from the name.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="slug">Slug (read-only)</label>
                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            readOnly
                            maxLength={30}
                            className="w-full outline-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="image">Image</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm">
                                <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <span>Add / Choose Image</span>
                            </label>
                            <div className="text-sm text-gray-600">{imageName || 'No image chosen'}</div>
                        </div>
                        {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                        <p className="text-xs text-gray-500 mt-1">Only the image name will be sent to the DB in this example. If you want file upload, enable it on server.</p>
                    </div>

                    {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                    {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

                    <div className="flex items-center gap-3">
                        <LoadingButton Loading={Loading} SetLoading={SetLoading} name="Save" />
                        <button
                            type="button"
                            onClick={() => { setName(''); setSlug(''); setImageFile(null); setImageName(''); setErrors({}); setSuccessMsg(''); SetLoading(false) }}
                            className="px-4 py-2 rounded-lg border cursor-pointer"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    )
}
