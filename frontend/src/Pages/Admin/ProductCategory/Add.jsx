import React, { useContext, useState } from 'react';
import Card from '../../../Components/Admin/Card';
import { MainContext } from '../../../ContextMain'
import axios from 'axios';
import Bradcrumbs from '../../../Components/Admin/Bradcrumbs';

function Add() {
    const [categoryName, setCategoryName] = useState('');
    const { Category, BACKEND_URL, SubCategoryBaseUrl, notify } = useContext(MainContext);
    const [categoryType, setCategoryType] = useState(null);
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState(null);


    const Bradcrumb = [
        {
            name: "Sub Category",
            path: "/admin/product-category/add"
        },
    ]



    // Validation state
    const [errors, setErrors] = useState({
        categoryName: '',
        image: ''
    });

    const generateSlug = (name) => {
        const slugified = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');  // Remove special chars
        setSlug(slugified);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setCategoryName(value);
        generateSlug(value);

        if (!value) {
            setErrors(prev => ({ ...prev, categoryName: 'Category Name is required' }));
        } else {
            setErrors(prev => ({ ...prev, categoryName: '' }));
        }
    };

    const handleTypeChange = (e) => {
        setCategoryType(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (!file) {
            setErrors(prev => ({ ...prev, image: 'Please select an image' }));
        } else {
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Final validation check
        let valid = true;
        if (!categoryName) {
            setErrors(prev => ({ ...prev, categoryName: 'Category Name is required' }));
            valid = false;
        }
        if (!image) {
            setErrors(prev => ({ ...prev, image: 'Please select an image' }));
            valid = false;
        }

        if (!valid) return;

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('slug', slug);
        formData.append('image', image);

        // For demo: log FormData values

        axios.post(BACKEND_URL + SubCategoryBaseUrl + "/create", formData, {
            params: { id: categoryType },
            withCredentials: true
        }).then((success) => {
            notify(success.data.message, "success")
        }).catch((err) => {
            console.log(err)
        })

        setCategoryName("")
        setSlug("")
        setImage("")
    };

    return (
        <Card>
            <Bradcrumbs Bradcrumb={Bradcrumb} />
            <h2 className="text-2xl font-bold mb-6 px-4">Add Product Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {/* Category Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Category Name</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={handleNameChange}
                        placeholder="Enter category name"
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${errors.categoryName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                    />
                    {errors.categoryName && <p className="text-red-500 text-sm mt-1">{errors.categoryName}</p>}
                </div>

                {/* Category Type */}
                <div>
                    <label className="block text-sm font-medium mb-1">Category Type</label>
                    <select
                        value={categoryType}
                        onChange={handleTypeChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value={null}>Choose</option>
                        {Category.map((item) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                    </select>
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                        type="text"
                        value={slug}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Category Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={`w-fit cursor-pointer px-4 rounded-2xl ${errors.image ? 'outline outline-red-500' : ''}`}
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
                >
                    Add Category
                </button>
            </form>
        </Card>
    );
}

export default Add;
