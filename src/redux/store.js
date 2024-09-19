import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createTransform, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./auth/authSlice.js";
import addOrderSlice from "./add-order/addOrderSlice.js";
import baseAPI from "./baseAPI.js";
import inventorySlice from "./inventory/inventorySlice.js";
import checkoutInfoCalSlice from "./checkoutInfoCal/checkoutInfoCalSlice.js";

const authSliceTransform = createTransform(
  (inboundState, key) => {
    if (key === "authSlice")
      return {
        token: inboundState.token,
        isUserLoading: true,
      };
    else return inboundState;
  },

  (outboundState, key) => {
    if (key === "authSlice")
      return {
        token: outboundState.token,
        isUserLoading: true,
      };
    else return outboundState;
  }
);

const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [authSliceTransform],
  whitelist: ["authSlice"],
  blacklist: ["checkoutInfoCalSlice", "addOrderSlice", "inventorySlice"],
};

const appReducer = combineReducers({
  authSlice,
  addOrderSlice,
  inventorySlice,
  checkoutInfoCalSlice,
  [baseAPI.reducerPath]: baseAPI.reducer,
});
const rootReducer = (state, action) => {
  if (action.type === "auth/signOut") {
    // this applies to all keys defined in persistConfig(s)
    storage.removeItem("persist:auth");
    state = {};
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(authPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseAPI.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export default store;
