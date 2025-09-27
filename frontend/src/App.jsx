import { createBrowserRouter, RouterProvider } from "react-router-dom"
import WebsiteMain from "./Pages/WebsiteMain"
import Home from "./Pages/Home"
import Store from "./Pages/Store"
import About from "./Pages/About"
import Profile from "./Pages/Profile"
import WishList from "./Pages/WishList"
import PrivacyPolicy from "./Pages/PrivacyPolicy"
import RefundPolicy from "./Pages/RefundPolicy"
import TermsandConditions from "./Pages/TermsandConditions"


function App() {


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
          path: "/store",
          element: <Store />
        },
        {
          path: "/about",
          element: <About />
        },
        {
          path: "/profile",
          element: <Profile />
        },
        {
          path: "/wishlist",
          element: <WishList />
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />
        },
        {
          path: "/refund-policy",
          element: <RefundPolicy />
        },
        {
          path: "/terms-conditions",
          element: <TermsandConditions />
        }
      ]
    }
  ])



  return (
    <RouterProvider router={route} />
  )
}

export default App
