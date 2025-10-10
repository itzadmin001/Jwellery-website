import { createSlice } from "@reduxjs/toolkit";


export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        data: null
    },
    reducers: {
        login: (currentState, { payload }) => {
            currentState.data = payload;
        },
        logout: (currentState, { payload }) => {
            currentState.data = null;
        },
        lsToState: (currentState, { payload }) => {
            currentState.data = payload;
        },
        SignupUser: (currentState, { payload }) => {
            currentState.data = payload
        }
    },
})


export const { login, logout, lsToState, SignupUser } = UserSlice.actions;
export default UserSlice.reducer;