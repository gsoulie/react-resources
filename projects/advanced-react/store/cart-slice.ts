import { createSlice } from '@reduxjs/toolkit';

export type Item = {
  id: string,
  name: string,
  price: number,
  qte?: number,
  totalPrice?: number
}

export type CartType = {
  items: Item[],
  totalQte: number,
  changed: boolean
}

const initialState: CartType = {
  items: [],
  totalQte: 0,
  changed: false
}

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    replaceCart(state, action) {
      state.totalQte = action.payload.totalQte;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQte++;
      state.changed = true;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          qte: 1,
          totalPrice: newItem.totalPrice
        })
      } else {
        existingItem.qte++;
        existingItem.totalPrice += newItem.price;
      }
    },
    removeItemToCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQte--;
      state.changed = true;

      if (existingItem?.qte === 1) {
        state.items = state.items.filter(items => items.id !== id)
      } else {
        if (existingItem) {
          existingItem.qte--;
          existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
        }

      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQte = 0;
      state.changed = false;
    }
  }
})

export const cartSliceActions = cartSlice.actions;

export default cartSlice;
