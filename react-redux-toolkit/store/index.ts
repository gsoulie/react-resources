import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter-slice';
import authReducer from './auth-slice';

export const store = configureStore({
  reducer: {	// ===> ICI, redux toolkit var merger les différents reducer en un seul reducer unique !!
    counterReducer: counterReducer,
    authReducer: authReducer
  }
});
