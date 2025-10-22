import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom"
import WebsiteMain from "./Pages/Website/WebsiteMain"
import Home from "./Pages/Website/Home"
import Store from "./Pages/Website/Store"
import About from "./Pages/Website/About"
import Profile from "./Pages/Website/Profile"
import WishList from "./Pages/Website/WishList"
import PrivacyPolicy from "./Pages/Website/PrivacyPolicy"
import RefundPolicy from "./Pages/Website/RefundPolicy"
import TermsandConditions from "./Pages/Website/TermsandConditions"
import Contact from "./Pages/Website/Contact"
import SignUp from "./Pages/Website/SignUp"
import Login from "./Pages/Website/Login"
import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { lsToState } from "./Reducers/UserSlice"
import ProductDetails from "./Pages/Website/ProductDetails"
import Shipping from "./Pages/Website/Shipping"
import { MainContext } from "./ContextMain"
import axios from "axios"
import AdminMain from "./Pages/Admin/AdminMain"
import Dashboard from "./Pages/Admin/Dashboard"
import { lsToCart } from "./Reducers/CartSlice"
import Orders from "./Pages/Admin/Orders"
import AdminLogin from "./Pages/Admin/AdminLogin"


// product all pages

import ProductView from "./Pages/Admin/Products/View"
import ProductAdd from "./Pages/Admin/Products/Add"



import { WishlistToState } from "./Reducers/WishList"
import MyOrders from "./Pages/Website/MyOrders"
import Transitions from "./Pages/Admin/Transitions"


function App() {
  const dispatch = useDispatch()
  const { BACKEND_URL, UserBaseUrl, notify } = useContext(MainContext)
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {

    axios.get(BACKEND_URL + UserBaseUrl + "/me", {
      withCredentials: true
    })
      .then((success) => {
        dispatch(lsToState(success.data.user))
      }).catch((err) => {
        dispatch(lsToState(null))
      }).finally(() => {
        setAuthLoading(false);
      });
    dispatch(lsToCart())
    dispatch(WishlistToState())

  }, [])

  const route = createBrowserRouter([
    {
      path: "/",
      element: <WebsiteMain />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "store",
          element: <Store />
        },
        {
          path: "store/:category/:product_category",
          element: <Store />
        },
        {
          path: "store/:category",
          element: <Store />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "profile",
          element: <Profile />
        },
        {
          path: "wishlist",
          element: <WishList />
        },
        {
          path: "contact",
          element: <Contact />
        },
        {
          path: "wishlist",
          element: <WishList />
        },
        {
          path: "orders",
          element: <MyOrders />
        },
        {
          path: "checkout",
          element: <Shipping />
        },
        {
          path: "productdetails/:id",
          element: <ProductDetails />
        },
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />
        },
        {
          path: "refund-policy",
          element: <RefundPolicy />
        },
        {
          path: "terms-conditions",
          element: <TermsandConditions />
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminMain authLoading={authLoading} />,
      children: [
        {
          path: "",
          element: <Dashboard />
        },
        {
          path: "order",
          element: <Orders />
        },
        {
          path: "product",
          element: <ProductView />
        },
        {
          path: "product/add",
          element: <ProductAdd />
        },
        {
          path: "transactions",
          element: <Transitions />
        }
      ]
    },
    {
      path: "*",
      element: <h1>Page Not Found</h1>

    },
    {
      path: "/sign-up",
      element: <SignUp />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/admin/login",
      element: <AdminLogin />

    }
  ])





  return (
    <RouterProvider router={route} />
  )
}

export default App
