import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Card from '../../../Components/Admin/Card'
import LoadingButton from '../../../Components/Admin/LoadingButton'
import { MainContext } from '../../../ContextMain'


export default function Edit() {
    const { BACKEND_URL, CategoryBaseUrl } = useContext(MainContext)
    const [Loading, SetLoading] = useState(false)
    const [UpdateData, SetUpdateData] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [file, setFile] = useState(null)
    const titleRef = useRef(null)
    const slugRef = useRef(null)

    // Support both query param (?id=...) and route param (/edit/:id)
    const [searchParams] = useSearchParams()
    const routeParams = useParams()
    const id = searchParams.get('id') || routeParams.id

    const navigate = useNavigate()

    useEffect(() => {
        if (!id) return
        const fetchCategory = async () => {
            try {
                const res = await axios.get(BACKEND_URL + CategoryBaseUrl + "/get", {
                    params: { id },
                    withCredentials: true
                })
                const data = res.data?.data || res.data
                SetUpdateData({
                    name: data?.name || '',
                    slug: data?.slug || '',
                    image: data?.image || ''
                })
                setPreviewImage(data?.image ? (`${BACKEND_URL}/${data.image}`) : null)
            } catch (err) {
                console.error('Fetch error', err)
            } finally {
                SetLoading(false)
            }
        }

        fetchCategory()
    }, [id])

    // titleToSlug: simple utility to convert title -> slug
    const titleToSlug = (title) => {
        if (!title) return ''
        return title
            .toString()
            .normalize('NFKD') // normalize accents
            .replace(/\s+/g, '-') // spaces to -
            .replace(/[^A-Za-z0-9\-]/g, '') // remove invalid chars
            .replace(/-+/g, '-') // collapse dashes
            .replace(/^-|-$/g, '') // trim dashes
            .toLowerCase()
    }

    const handleNameChange = (e) => {
        const newName = e.target.value
        SetUpdateData(prev => ({
            ...prev,
            name: newName,
            slug: titleToSlug(newName)
        }))
    }

    const handleFileChange = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        // preview
        const reader = new FileReader()
        reader.onload = () => setPreviewImage(reader.result)
        reader.readAsDataURL(f)
    }

    const fromSubmitHandler = async (e) => {
        e.preventDefault()
        if (!UpdateData) return
        try {
            SetLoading(true)
            const formData = new FormData()
            formData.append('name', UpdateData.name)
            formData.append('slug', UpdateData.slug)
            if (file) formData.append('image', file)

            // Use PATCH or PUT according to your API
            const res = await axios.put(`${BACKEND_URL}${CategoryBaseUrl}/update/${id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            navigate("/admin/category/view")

        } catch (err) {
            console.error('Update error', err)
        } finally {
            SetLoading(false)
            SetUpdateData(null)

        }
    }

    return (
        <Card>
            <div className="w-full max-w-full p-4 mt-5 bg-white/60 border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 text-black dark:border-gray-700">
                <form className="space-y-6" onSubmit={fromSubmitHandler} encType='multipart/form-data'>

                    {/* Name */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Name</label>
                        <input
                            type="text"
                            name="name"
                            ref={titleRef}
                            className=" bg-gray-50 border dark:bg-gray-800 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Enter name"
                            required
                            value={UpdateData?.name || ''}
                            onChange={handleNameChange}
                        />
                    </div>

                    {/* Slug (readonly, realtime) */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            ref={slugRef}
                            value={UpdateData?.slug || ''}
                            readOnly
                            placeholder='Slug'
                            className="bg-gray-50 border dark:bg-gray-800 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Bunner Image</label>

                        <div className="mb-2">
                            <img src={UpdateData?.image} alt="preview" className="w-32 h-32 object-cover rounded" />
                        </div>

                    </div>
                    {/* Image preview + file input */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Image</label>
                        {previewImage && (
                            <div className="mb-2">
                                <img src={previewImage} alt="preview" className="w-32 h-32 object-cover rounded" />
                            </div>
                        )}

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-800 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>

                    <LoadingButton Loading={Loading} SetLoading={SetLoading} name={"Update"} />
                </form>
            </div>
        </Card>
    )
}
