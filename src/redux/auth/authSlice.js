import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  isUserLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isUserLoading = false;
    },
    signOut: (state) => {
      state.token = null;
      state.user = null;
      state.isUserLoading = true;
    },
  },
});

export const { setToken, setUser, signOut } = authSlice.actions;
export default authSlice.reducer;
