import baseAPI from "../../baseAPI.js";

const reportAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getReport: build.query({
      query: ({ cp, filter, search, uid, toDate, fromDate, limit }) =>
        `reports/get-report?page=${++cp}${limit ? `&limit=${limit}` : ""}${
          filter ? `&filter=${filter}` : ""
        }${search ? `&search=${search}` : ""}${
          uid ? `&user_id=${uid}` : ""
        }&toDate=${toDate || ""}&fromDate=${fromDate || ""}`,
    }),
    getAllReport: build.query({
      query: ({ cp, filter, search, toDate, fromDate, limit }) =>
        `reports/get-all-report?page=${++cp}${limit ? `&limit=${limit}` : ""}${
          filter ? `&filter=${filter}` : ""
        }${search ? `&search=${search}` : ""}&toDate=${toDate || ""}&fromDate=${
          fromDate || ""
        }`,
      providesTags:['adminReport']
    }),
  }),
});

export const { useGetReportQuery, useGetAllReportQuery } = reportAPI;
