import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "../Reducers/UserSlice"
import CartReducer from "../Reducers/CartSlice"
import WishlistReducer from "../Reducers/WishList"


export default configureStore({
    reducer: {
        user: UserReducer,
        cart: CartReducer,
        wishlist: WishlistReducer

    },
})