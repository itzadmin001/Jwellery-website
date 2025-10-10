import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MainContext from "./ContextMain.jsx"
import store from "./Store/Store.js"
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MainContext>
      <App />
    </MainContext>,
  </Provider>
)
