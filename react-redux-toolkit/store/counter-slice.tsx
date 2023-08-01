import { createSlice } from "@reduxjs/toolkit";

export type StateType = {
  counter: number;
  toggle: boolean;
};

const initialState: StateType = { counter: 0, toggle: true };

const counterSlice = createSlice({
  name: "counterSlice",
  initialState,
  reducers: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    incrementByValue(state, action) {
      state.counter = state.counter + action.payload;
    },
    toggle(state) {
      state.toggle = !state.toggle;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
