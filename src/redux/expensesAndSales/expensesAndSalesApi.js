import baseAPI from "../baseAPI";

const expensesAndSalesApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    updateExpensesItem: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `expenses/update-expense/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["GetExpenses", "expenses"],
    }),
    removeExpenses: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `expenses/reduce-expense/${id}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        "GetExpenses",
        "expenses",
        "subDashboard",
        "mainDashboard",
      ],
    }),
    getSubDashBoardInfo: builder.query({
      query: (managerId) => `subdashboards/get-subdashboard-info/${managerId}`,
      providesTags: ["subDashboard"],
    }),
    getReportsByDate: builder.query({
      query: ({ date, hotelId, cp }) =>
        `reports/get-reports-by-date?date=${date}&hotel_id=${hotelId}${
          cp ? `&page=${++cp}` : ""
        }`,
    }),
  }),
});

export const {
  useUpdateExpensesItemMutation,
  useGetSubDashBoardInfoQuery,
  useGetReportsByDateQuery,
  useRemoveExpensesMutation,
} = expensesAndSalesApi;
