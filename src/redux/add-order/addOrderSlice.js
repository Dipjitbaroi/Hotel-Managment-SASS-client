import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: {
    roomId: "",
    tableId: "",
    foods: [],
  },
  orderCalc: {
    total: 0,
    tax: 0,
    grandTotal: 0,
  },
  amountAfterDiscount: 0,
  bookingId: "",
};

const addOrderSlice = createSlice({
  name: "addOrder",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order.foods = action.payload;
    },
    setRoomId: (state, action) => {
      state.order.roomId = action.payload;
      state.order.tableId = "";
    },
    setTableId: (state, action) => {
      state.order.tableId = action.payload;
      state.order.roomId = "";
    },
    delOrder: (state, action) => {
      const findFoodIdx = state.order.foods.findIndex(
        (item) => item._id === action.payload._id
      );

      state.order.foods.splice(findFoodIdx, 1);
    },
    setQuantity: (state, action) => {
      const findFoodIdx = state.order.foods.findIndex(
        (item) => item._id === action.payload._id
      );

      if (action.payload.quantity) {
        state.order.foods.splice(findFoodIdx, 1, {
          ...action.payload.food,
          quantity: action.payload.quantity,
        });
      } else {
        state.order.foods.splice(findFoodIdx, 1, {
          ...action.payload.food,
          quantity: 1,
        });
      }
    },
    manipulateQuantity: (state, action) => {
      const findFoodIdx = state.order.foods.findIndex(
        (item) => item._id === action.payload.food._id
      );

      if (findFoodIdx !== -1) {
        state.order.foods.splice(findFoodIdx, 1, {
          ...state.order.foods[findFoodIdx],
          quantity: action.payload.quantity,
        });
      }
    },
    setOrderCalc: (state, action) => {
      const total = state?.order?.foods?.reduce(
        (total, current) => total + current.quantity * current.price,

        0
      );

      const tax = total * 0.03;
      const grandTotal = total + tax;

      state.orderCalc = {
        total: total.toFixed(2),
        tax: tax.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      };
    },

    removeAction: (state, action) => {
      const { quantity, price } = action.payload;
      const totalToRemove = quantity * price;
      state.orderCalc.total = +state.orderCalc.total - totalToRemove;
    },

    resetFoodOrder: (state) => {
      state.order = {
        roomId: "",
        tableId: "",
        foods: [],
      };
    },

    setAmountAfterDis: (state, action) => {
      state.amountAfterDiscount = action.payload;
    },
    setBookingId: (state, action) => {
      state.bookingId = action.payload;
    },
    clearAddOrderSlice: (state) => {
      state = initialState;
    },
  },
});

export const {
  setOrder,
  delOrder,
  setQuantity,
  manipulateQuantity,
  setOrderCalc,
  removeAction,
  resetFoodOrder,
  setRoomId,
  setTableId,
  setAmountAfterDis,
  setBookingId,
  clearAddOrderSlice,
} = addOrderSlice.actions;
export default addOrderSlice.reducer;
