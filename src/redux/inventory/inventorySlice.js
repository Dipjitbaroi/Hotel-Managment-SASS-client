import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: {
    roomNumber: null,
    items: [],
  },
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    delOrder: (state, action) => {
      const findFoodIdx = state.order.items.findIndex(
        (item) => item._id === action.payload._id,
      );

      state.order.items.splice(findFoodIdx, 1);
    },
    resetInv: (state) => {
      state.order = {
        roomNumber: null,
        items: [],
      };
    },
  },
});

export const { setOrder, delOrder, resetInv } = inventorySlice.actions;
export default inventorySlice.reducer;
