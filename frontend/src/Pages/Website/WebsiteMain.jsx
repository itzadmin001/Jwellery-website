import React from 'react'
import Header from '../../Components/Website/Header'
import Footer from "../../Components/Website/Footer"
import { Outlet } from 'react-router-dom'

function WebsiteMain() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default WebsiteMain
