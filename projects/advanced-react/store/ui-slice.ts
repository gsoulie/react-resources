import { createSlice } from '@reduxjs/toolkit';

export enum NotificationStatus {
  pending = 'pending',
  success = 'success',
  error = 'error'
}

export type Notification = {
  status: NotificationStatus,
  title?: string,
  message?: string
}

const initialState: { cartVisible: boolean, notification: Notification | null } =
  { cartVisible: false, notification: null }

const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    toggleCart(state) {
      state.cartVisible = !state.cartVisible
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title ?? '',
        message: action.payload.message ?? ''
      }
    }
  }
});

export const uiSliceActions = uiSlice.actions

export default uiSlice;
