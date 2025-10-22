import React, { useState } from 'react'
import { MdDashboard } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IoCaretDown } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";



function SideBar() {



    const menu = [
        {
            name: "Dashboard",
            icon: <MdDashboard />,
            url: "/admin",

        },
        {
            name: "Orders",
            icon: <MdLocalShipping />,
            url: "/admin/order",

        },
        {
            name: "Products",
            icon: <AiFillProduct />,
            url: "/admin/product",
        },
        {
            name: "Transions",
            icon: < RiSecurePaymentLine />,
            url: "/admin/transactions",

        },

    ]





    return (
        <div className='bg-black min-h-screen'>
            <h1 className='text-white font-semibold text-3xl text-center py-3'>Admin panel</h1>
            <hr />
            <ul className='text-gray-300 text-sm '>
                {menu.map((item, i) => {
                    return (
                        <Listitem data={item} key={i} index={i} />
                    )
                })}
            </ul>
        </div>
    )
}

const Listitem = ({ data, index }) => {
    return (
        <>

            <Link to={data.url} className='ml-2 px-2 text-lg select-none flex gap-2 items-center py-2 cursor-pointer text-zinc-300 hover:text-white'>
                <span>{data.icon}</span> {data.name}</Link>
        </>
    )
}

export default SideBar
