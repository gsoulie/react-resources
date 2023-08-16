import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui-slice';
import cartSlice from './cart-slice';

export const store = configureStore({
  reducer: {
    uiReducer: uiSlice.reducer,
    cartReducer: cartSlice.reducer
  }
})

// IMPORTANT : nécessaire pour éviter une erreur typescript lors du dispatch sur action creator
export type AppDispatch = typeof store.dispatch;
