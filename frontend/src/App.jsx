import { createBrowserRouter, RouterProvider } from "react-router-dom"
import WebsiteMain from "./Pages/WebsiteMain"
import Home from "./Pages/Home"
import Store from "./Pages/Store"
import About from "./Pages/About"
import Profile from "./Pages/Profile"
import WishList from "./Pages/WishList"


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
        }
      ]
    }
  ])



  return (
    <RouterProvider router={route} />
  )
}

export default App
