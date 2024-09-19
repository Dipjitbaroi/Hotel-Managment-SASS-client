import baseAPI from "../../baseAPI.js";

const slsAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addLicense: build.mutation({
      query: (data) => {
        return {
          url: "users/add-license",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["owner", "adminReport"],
    }),
    renewLicense: build.mutation({
      query: (data) => {
        return {
          url: "users/renew-license",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [
        "owner",
        "status_log",
        "getUserById",
        "adminReport",
        "mainDashboard",
      ],
    }),
    updateLicenseStatus: build.mutation({
      query: (data) => {
        return {
          url: "users/update-status",
          method: "PATCH",
          body: data,
        };
      },
      providesTags: ["updateStatus"],
      invalidatesTags: ["owner", "status_log", "getUserById", "mainDashboard"],
    }),
  }),
});

export const {
  useAddLicenseMutation,
  useRenewLicenseMutation,
  useUpdateLicenseStatusMutation,
} = slsAPI;
