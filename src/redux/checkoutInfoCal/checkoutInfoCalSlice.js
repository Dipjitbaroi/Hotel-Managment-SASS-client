import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calculatePayableAmount: 0,
  calculateUnpaidAmount: 0,
  calculateTotalRent: 0,
  calculateBalance: 0,
  subTotals: 0,
  tax: 0,
  serviceCharge: 0,
  additionalCharge: 0,
  discountOffer: 0,
  grandTotal: 0,
  roomPostedBill: 0,
  extraDiscount: 0,
  refundAmount: 0,
  bookingInfo: "",
  collectedAmount: 0,
  texAmount: 0,
  toDate: "",
  fromDate: "",
  calculateNOD: 0,
  calculateAmountAfterDis: 0,
  roomInfo: {},
  calculateCollectedAmount: 0,
  selectedRoomAmountAfterDiscount: 0,
};

const checkoutInfoCalSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
    },
    setCalculatePayableAmount: (state, action) => {
      state.calculatePayableAmount = action.payload;
    },
    setCalculateUnpaidAmount: (state, action) => {
      state.calculateUnpaidAmount = action.payload;
    },
    updateSubTotal: (state, action) => {
      state.subTotals = action.payload;
    },
    updateTax: (state, action) => {
      state.tax = action.payload;
    },
    updateServiceCharge: (state, action) => {
      state.serviceCharge = action.payload;
    },
    updateAdditionalCharge: (state, action) => {
      state.additionalCharge = action.payload;
    },
    updateDiscountOffer: (state, action) => {
      state.discountOffer = action.payload;
    },
    setGrandTotal: (state, action) => {
      state.grandTotal = action.payload;
    },
    setRoomPostedBill: (state, action) => {
      state.roomPostedBill = action.payload;
    },
    setExtraDiscount: (state, action) => {
      state.extraDiscount = action.payload;
    },
    setBookingInfo: (state, action) => {
      state.bookingInfo = action.payload;
    },
    setRefundAmount: (state, action) => {
      state.refundAmount = action.payload;
    },
    setCollectedAmount: (state, action) => {
      state.collectedAmount = action.payload;
    },
    setTexAmount: (state, action) => {
      state.texAmount = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setCalculateNOD: (state, action) => {
      state.calculateNOD = action.payload;
    },
    setCalculateAmountAfterDis: (state, action) => {
      state.calculateAmountAfterDis = action.payload;
    },
    setSelectedRoomAmountAfterDiscount: (state, action) => {
      state.selectedRoomAmountAfterDiscount = action.payload;
    },
    setCalculateTotalRent: (state, action) => {
      state.calculateTotalRent = action.payload;
    },
    setCalculateBalance: (state, action) => {
      state.calculateBalance = action.payload;
    },
    setCalculateCollectedAmount: (state, action) => {
      state.calculateCollectedAmount = action.payload;
    },
    clearCheckoutCalSlice: (state) => {
      state.calculatePayableAmount = 0;
      state.calculateUnpaidAmount = 0;
      state.calculateTotalRent = 0;
      state.calculateBalance = 0;
      state.subTotals = 0;
      state.tax = 0;
      state.serviceCharge = 0;
      state.additionalCharge = 0;
      state.discountOffer = 0;
      state.grandTotal = 0;
      state.roomPostedBill = 0;
      state.extraDiscount = 0;
      state.refundAmount = 0;
      state.bookingInfo = "";
      state.collectedAmount = 0;
      state.texAmount = 0;
      state.toDate = "";
      state.fromDate = "";
      state.calculateNOD = 0;
      state.calculateAmountAfterDis = 0;
      state.roomInfo = {};
      state.calculateCollectedAmount = 0;
      state.selectedRoomAmountAfterDiscount = 0;
    },
  },
});

export const {
  setRoomInfo,
  setCalculatePayableAmount,
  setCalculateUnpaidAmount,
  updateSubTotal,
  updateTax,
  updateServiceCharge,
  updateAdditionalCharge,
  updateDiscountOffer,
  setGrandTotal,
  setRoomPostedBill,
  setExtraDiscount,
  setBookingInfo,
  setRefundAmount,
  setTexAmount,
  setToDate,
  setFromDate,
  setCalculateNOD,
  clearCheckoutCalSlice,
  setCalculateAmountAfterDis,
  setSelectedRoomAmountAfterDiscount,
  setCalculateTotalRent,
  setCalculateBalance,
  setCalculateCollectedAmount,
} = checkoutInfoCalSlice.actions;

export default checkoutInfoCalSlice.reducer;
