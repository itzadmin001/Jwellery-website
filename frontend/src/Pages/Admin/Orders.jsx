import React, { useContext, useEffect, useRef, useState } from 'react'
import Card from '../../Components/Admin/Card'
import Bradcrumbs from '../../Components/Admin/Bradcrumbs'
import axios from 'axios';
import { MainContext } from '../../ContextMain';
import { useNavigate } from 'react-router-dom';

const Bradcrumb = [
    {
        name: "Orders",
        path: "/admin/Orders"
    }
]

function Orders() {
    const { BACKEND_URL, OrderBaseUrl, notify } = useContext(MainContext);
    const [order, SetOrder] = useState([])
    const Navigate = useNavigate()




    const GetOrderData = () => {
        axios.get(BACKEND_URL + OrderBaseUrl + "/admin/get", {
            withCredentials: true
        })
            .then(
                (success) => {
                    SetOrder(success.data.data)
                }
            ).catch(
                (error) => {
                }
            )
    }

    useEffect(
        () => {
            GetOrderData()

        }, []
    )


    const OrderStatusChange = (id, new_status) => {

        axios.patch(BACKEND_URL + OrderBaseUrl + "/update-status", null, {
            params: { id, new_status },
            withCredentials: true
        })
            .then((success) => {
                GetOrderData()
            })
            .catch((err) => {
                console.log(err);
            });

    }

    const removeProduct = (pId) => {
        axios.delete(BACKEND_URL + OrderBaseUrl + "/delete" + "/" + pId, {
            withCredentials: true
        })
            .then((success) => {
                console.log(success)
                GetOrderData()
                notify(success.data.message, "success")
            }).catch((err) => {
                notify(err.response.data.message, "error")
            })
    }






    return (
        <Card>
            <div className='p-2'>
                {/* <input type="date" className=' cursor-pointer' />
                <input type="date" className=' cursor-pointer' /> */}
            </div>
            <Bradcrumbs Bradcrumb={Bradcrumb} />
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-800">
                    <thead className="text-xs text-gray-200 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Sr
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product Details
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Shipping Details
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            order?.map((Od, i) => {
                                return (
                                    <TableRow Od={Od} key={i} index={i} OrderStatusChange={OrderStatusChange} removeProduct={removeProduct} />

                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const TableRow = ({ Od, index, i, OrderStatusChange, removeProduct }) => {

    const [orderStatus, SetorderStatus] = useState(Od.status)







    return (
        <tr className="bg-white border-b dark:bg-gray4200 dark:border-gray-400">
            <th
                scope="col"
                className="px-6 py-3"
            > {index + 1}</th>
            <th
                scope="row"
                className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-black"
            >
                {
                    Od.product_detail.map(
                        (detail, i) => {
                            return (
                                <div key={i}>
                                    <div className=' py-1'> <b>{i + 1} ) </b>
                                        Name: {detail.name}
                                    </div>
                                    <div className='py-1'>
                                        Price: {detail.price}
                                    </div>
                                    <div className='py-1'>
                                        qty:  {detail.qty}
                                    </div>
                                </div>
                            )
                        }
                    )
                }
            </th>
            <td className="px-6 py-4">


                <div>
                    city : {Od.shippingAddress.city}
                </div>
                <div>
                    state : {Od.shippingAddress.state}
                </div>
                <div>
                    Contact : {Od.shippingAddress.phone}
                </div>
                <div>
                    Name : {Od.user.name}
                </div>

            </td>
            <td className="px-6 py-4">
                <select
                    value={Od.status}
                    onChange={(e) => OrderStatusChange(Od._id, e.target.value)}
                    className="dark:bg-gray-200 p-2"
                >
                    <option value={Od.status} disabled>
                        {Od.status}
                    </option>

                    {["pending", "confirmed", "cancelled", "shipped", "delivered"]
                        .filter((status) => status !== Od.status)
                        .map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                </select>

            </td>
            <td className="px-6 py-4 ">
                {new Date(Od.createdAt).toLocaleDateString()}
                <br />
                {new Date(Od.createdAt).toLocaleTimeString()}
                <hr />
                {new Date(Od.updatedAt).toLocaleDateString()}
                <br />
                {new Date(Od.updatedAt).toLocaleTimeString()}
            </td>
            <td className="px-6 py-4 ">
                <div className="flex  items-center justify-center gap-2">
                    <button
                        onClick={() => removeProduct(Od._id)}
                        className="px-2 cursor-pointer   py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </td>


        </tr>
    )
}

export default Orders
