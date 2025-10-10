import { createSlice } from "@reduxjs/toolkit";

export const WishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        data: [],
    },
    reducers: {
        AddToWishlist: (state, { payload }) => {
            const { pId } = payload;
            const exists = state.data.find(item => item.pId === pId);
            if (!exists) {
                state.data.push({
                    pId
                });
            }
            localStorage.setItem("wishlist", JSON.stringify([...state.data]));
        },

        RemoveToWishlist: (state, { payload }) => {
            state.data = state.data.filter(item => item.pId !== payload.pId);
            localStorage.setItem("wishlist", JSON.stringify([...state.data]));
            console.log(state.data)
        },

        WishlistToState: (state) => {
            try {
                const saved = JSON.parse(localStorage.getItem("wishlist"));
                if (Array.isArray(saved)) {
                    state.data = saved;
                } else {
                    state.data = [];
                }
            } catch (error) {
                console.error("Invalid wishlist data in localStorage", error);
                state.data = [];
            }
        },

        DeleteAllWishlist: (state) => {
            state.data = [];
            localStorage.setItem("wishlist", JSON.stringify([]));
        },
        DbToWishList: (state, { payload }) => {
            // Replace state with new payload
            state.data = payload;
            // Update localStorage
            localStorage.setItem("wishlist", JSON.stringify(state.data));
        }
    },
});

export const {
    AddToWishlist,
    DbToWishList,
    RemoveToWishlist,
    WishlistToState,
    DeleteAllWishlist
} = WishlistSlice.actions;

export default WishlistSlice.reducer;
