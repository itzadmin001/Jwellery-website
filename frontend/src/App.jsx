import { createBrowserRouter, RouterProvider } from "react-router-dom"
import WebsiteMain from "./Pages/WebsiteMain"
import Home from "./Pages/Home"
import Store from "./Pages/Store"


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
        }
      ]
    }
  ])



  return (
    <RouterProvider router={route} />
  )
}

export default App
