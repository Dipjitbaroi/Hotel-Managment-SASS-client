import baseAPI from "../baseAPI.js";

const employeeAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    employee: build.query({
      query: ({ cp, filter, search }) =>
        `employee/get-employees?page=${++cp}${
          filter ? `&filter=${filter}` : ""
        }${search ? `&name=${search}` : ""}`,
      providesTags: ["employee"],
    }),
    addEmployee: build.mutation({
      query: (data) => {
        return {
          url: "employee/add-employee",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["employee"],
    }),
    deleteEmployee: build.mutation({
      query: (id) => {
        return {
          url: `employee/delete-employee/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["employee"],
    }),
    updateEmployee: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `employee/update-employee/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee"],
    }),
  }),
});

export const {
  useEmployeeQuery,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
} = employeeAPI;
