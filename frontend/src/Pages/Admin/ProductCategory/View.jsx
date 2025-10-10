import React, { useContext, useEffect, useState } from 'react'
import Bradcrumbs from '../../../Components/Admin/Bradcrumbs'
import { MainContext } from "../../../ContextMain"
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios"
import { Link } from 'react-router-dom';
import Card from '../../../Components/Admin/Card';

function View() {
    const { BACKEND_URL, fetchSubCategory, SubCategoryBaseUrl, Subcategory, notify } = useContext(MainContext);



    const Bradcrumb = [
        {
            name: "Sub Category",
            path: "/admin/product-category/add"
        },
        {
            name: "View",
            path: "/admin/product-category/View"
        }
    ]


    const delDeta = (cId) => {
        axios.delete(BACKEND_URL + SubCategoryBaseUrl + "/delete" + "/" + cId, {
            withCredentials: true
        })
            .then((success) => {
                fetchSubCategory()
                notify(success.data.message, "success")
            }).catch((err) => {
                notify(err.response.data.message, "error")
            })
    }

    const changeStatus = (id, status) => {
        axios.patch(BACKEND_URL + SubCategoryBaseUrl + "/change-status/" + id + "/" + status, {}, {
            withCredentials: true
        })
            .then((success) => {
                fetchSubCategory()
                notify(success.data.message, "success")
            }).catch((err) => {
                notify(err.response.data.message, "error")
            })
    }
    return (
        <Card>
            <Bradcrumbs Bradcrumb={Bradcrumb} />
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
                                Store Bunner  Image
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
                            Subcategory?.map((cat, i) => {
                                return (
                                    <tr key={cat._id} className="bg-white border-b text-black">
                                        <th
                                            scope="col"
                                            className="px-6 py-3"
                                        > {i + 1}</th>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                                        >
                                            {
                                                cat.name
                                            }
                                        </th>
                                        <td className="px-6 py-4">{cat.slug}</td>
                                        <td className="px-6 py-4 ">
                                            <img src={cat.image} width={70} alt="" />
                                        </td>
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
                                            <Link to={"/admin/category/edit/" + cat._id}>
                                                <MdOutlineEdit className='cursor-pointer hover:text-blue-500' />
                                            </Link>
                                        </td>
                                    </tr>

                                )
                            })
                        }

                    </tbody>
                </table>
            </div>

        </Card>
    )
}

export default View
