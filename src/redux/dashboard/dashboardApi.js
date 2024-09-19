import baseAPI from "../baseAPI";

const dashboardApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getDashboardInfo: build.query({
      query: (id) => `dashboards/get-dashboard-info/${id}`,
      providesTags: ["mainDashboard", "cancelBooking", "booking"],
    }),
  }),
});

export const { useGetDashboardInfoQuery } = dashboardApi;
