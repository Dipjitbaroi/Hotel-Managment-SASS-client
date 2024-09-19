import baseAPI from "./../baseAPI.js";

const reportAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getManagerReport: build.query({
      query: ({ cp, filter, search, toDate, fromDate, limit }) =>
        `reports/get-rooms-reports-by-hotel?page=${++cp}${
          limit ? `&limit=${limit}` : ""
        }${filter ? `&filter=${filter}` : ""}${
          search ? `&search=${search}` : ""
        }&toDate=${toDate || ""}&fromDate=${fromDate || ""}`,
      providesTags: ["getManagerReport"],
    }),

    getPaymentSources: build.query({
      query: ({
        cp,
        toDate,
        fromDate,
        limit,
        user_id,
        dedicated_to,
        payment_method,
      }) =>
        `balances/get-financial-overview?page=${++cp}${
          limit ? `&limit=${limit}` : ""
        }${payment_method ? `&payment_method=${payment_method}` : ""}&toDate=${
          toDate || ""
        }&fromDate=${fromDate || ""}${user_id ? `&user_id=${user_id}` : ""}${
          dedicated_to ? `&dedicated_to=${dedicated_to}` : ""
        }`,
      providesTags: ["getPaymentSource"],
    }),
  }),
});

export const { useGetManagerReportQuery, useGetPaymentSourcesQuery } =
  reportAPI;
