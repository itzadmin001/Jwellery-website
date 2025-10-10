import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import axios from 'axios';
import { MainContext } from "../../ContextMain"

function Header() {
    const Navigate = useNavigate()
    const { UserBaseUrl, BACKEND_URL, notify } = useContext(MainContext);
    const LogoutHandler = () => {
        axios.get(BACKEND_URL + UserBaseUrl + "/logout", {
            withCredentials: true
        })
            .then(
                (success) => {
                    notify("Logged Out Successfully", "success");
                    Navigate("/admin/login")
                }
            ).catch(
                (err) => {
                    notify("Failed to Logout", "error");
                    console.log(err);
                }
            )
    }
    return (
        <div className='py-2 pr-3 bg-white flex justify-end shadow items-center gap-5 text-xl font-semibold'>
            <div >
                <CgProfile />
            </div>
            <Link to="/admin/login" onClick={LogoutHandler}>
                Logout
            </Link>
        </div>
    )
}

export default Header
