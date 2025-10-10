import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
    name: "cart",
    initialState: {
        data: [],
        total: 0
    },
    reducers: {
        addToCart: (currentState, { payload }) => {
            currentState.data = currentState.data || [];
            currentState.total = currentState.total || 0;

            const Founditem = currentState.data.find(i => i.pId === payload.pId);
            if (!Founditem) {
                currentState.data.push({
                    pId: payload.pId,
                    qty: 1,
                });
            } else {
                Founditem.qty++;
            }
            currentState.total = Number(Math.round(currentState.total + payload.price));


            localStorage.setItem("cart", JSON.stringify(currentState));
        },
        lsToCart: (currentState, { payload }) => {
            const Getitem = JSON.parse(localStorage.getItem("cart"));

            if (Getitem) {
                currentState.data = Getitem.data;
                currentState.total = Math.round(parseInt(Getitem.total));
            }
        },
        empptyCart: (currentState) => {
            currentState.data = []
            currentState.total = 0
            localStorage.removeItem("cart");
        },
        Changeqty: (currentState, { payload }) => {
            let Foundindex = null;
            const Founditem = currentState.data.find((item, index) => {
                if (item.pId === payload.pId) {
                    Foundindex = index;
                    return true;
                }
                return false;
            });
            if (Founditem) {
                if (payload.flag === 1) {
                    Founditem.qty++;
                    currentState.total = Math.round(currentState.total + parseInt(payload.price));
                } else {
                    if (Founditem.qty === 1) {
                        currentState.data.splice(Foundindex, 1);
                    }
                    Founditem.qty--;
                    currentState.total = Math.round(currentState.total - parseInt(payload.price));
                }
            }
            localStorage.setItem("cart", JSON.stringify(currentState));
        },
        DbTocart: (currentState, { payload }) => {
            currentState.data = payload.newCart
            currentState.total = payload.total
            localStorage.setItem("cart", JSON.stringify(currentState));

        }
    }
});

export const { addToCart, lsToCart, Changeqty, empptyCart, DbTocart } = CartSlice.actions;
export default CartSlice.reducer;
