import { createSlice } from '@reduxjs/toolkit';
import { getProductId } from '../config/api';

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const item = action.payload;
            const itemId = getProductId(item);
            const existingItem = state.find((i) => getProductId(i) === itemId);
            if (existingItem) {
                existingItem.quantity += item.quantity ?? 1;
            } else {
                state.push({ ...item, id: itemId, quantity: item.quantity ?? 1 });
            }
        },
        deleteFromCart(state, action) {
            return state.filter(item => getProductId(item) !== getProductId(action.payload));
        },
        incrementQuantity(state, action) {
            const item = state.find((i) => getProductId(i) === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decrementQuantity(state, action) {
            const item = state.find((i) => getProductId(i) === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
    },
});

export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
