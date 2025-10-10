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


// category all pages

import CategoryAdd from "./Pages/Admin/Category/Add"
import CategoryEdit from "./Pages/Admin/Category/Edit"
import CategoryView from "./Pages/Admin/Category/View"


// product all pages 

import ProductAdd from "./Pages/Admin/Products/Add"
import ProductEdit from "./Pages/Admin/Products/Edit"
import ProductView from "./Pages/Admin/Products/View"


// product category pages 

import ProductCategoryView from "./Pages/Admin/ProductCategory/View"
import ProductCategoryAdd from "./Pages/Admin/ProductCategory/Add"
import ProductCategoryEdit from "./Pages/Admin/ProductCategory/Edit"
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
          path: "category",
          children: [
            {

              path: "/admin/category/add",
              element: <CategoryAdd />
            },
            {
              path: "/admin/category/view",
              element: <CategoryView />
            },
            {
              path: "/admin/category/edit/:id",
              element: <CategoryEdit />
            }
          ]
        },
        {
          path: "product",
          children: [
            {

              path: "/admin/product/add",
              element: <ProductAdd />
            },
            {
              path: "/admin/product/view",
              element: <ProductView />
            },
            {
              path: "/admin/product/edit/:id",
              element: <ProductEdit />
            }
          ]
        },
        {
          path: "product-category",
          children: [
            {

              path: "/admin/product-category/add",
              element: <ProductCategoryAdd />
            },
            {
              path: "/admin/product-category/view",
              element: <ProductCategoryView />
            },
            {
              path: "/admin/product-category/edit/:id",
              element: < ProductCategoryEdit />
            }
          ]
        },
        {
          path: "transtions",
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
