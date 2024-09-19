import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { signOut } from "./auth/authSlice.js";

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_URL_STATUS === "development"
      ? "http://localhost:5001"
      : import.meta.env.VITE_URL_STATUS === "production"
      ? "https://v1.dakhotel.com"
      : "",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().authSlice.token;

    if (token) headers.set("authorization", `Bearer ${token}`);

    return headers;
  },
  mode: 'cors'
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let response = await baseQuery(args, api, extraOptions);

  if (response.error && [401, 403].includes(response.error.originalStatus)) {
    api.dispatch(signOut());
  }

  return response;
};

const baseAPI = createApi({
  reducerPath: "baseAPI",
  tagTypes: [
    "auth",
    "room",
    "food",
    "inventory",
    "employee",
    "owner",
    "subadmin",
    "hotels",
    "order",
    "bar",
    "checkout",
    "category",
    "booking",
    "GetExpenses",
    "expenses",
    "mainDashboard",
    "subDashboard",
    "updateOrder",
    "roomPostedBill",
    "getManagerReport",
    "cancelBooking",
    "getUserById",
    "updateStatus",
    "adminReport",
    "getPaymentSource",
  ],
  baseQuery: baseQueryWithReAuth,
  endpoints: (build) => ({
    upload: build.mutation({
      query: (data) => {
        return {
          url: "upload",
          method: "POST",
          body: data,
        };
      },
    }),
    uploadSingle: build.mutation({
      query: (data) => {
        return {
          url: "single-upload",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useUploadMutation, useUploadSingleMutation } = baseAPI;
export default baseAPI;
