import React, { useEffect, useState } from 'react';
import Header from '../../Components/Admin/Header';
import SideBar from '../../Components/Admin/SideBar';
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function AdminMain({ authLoading }) {
    const user = useSelector((state) => state.user.data);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    useEffect(() => {


        if (authLoading) return;

        if (user === null) {
            navigate("/admin/login", { replace: true });

        } else if (user.role !== "admin") {

            navigate("/admin/login", { replace: true });

        } else {
            setLoading(false);
        }
    }, [authLoading, user]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;
    }
    return (
        <div className='grid grid-cols-5 min-h-screen'>
            <SideBar />
            <div className='col-span-4'>
                <Header />
                <div className='p-3'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminMain;
