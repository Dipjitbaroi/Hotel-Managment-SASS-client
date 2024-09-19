import baseAPI from "../../baseAPI.js";

const slsAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addSubAdmin: build.mutation({
      query: (data) => {
        return {
          url: "users/add-user",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["subadmin", "employee"],
    }),
    getUser: build.query({
      query: (id) => `users/get-user-by-id/${id}`,
      providesTags: ["subadmin", "getUserById"],
      invalidatesTags: ["updateStatus"],
    }),
    updateUser: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `users/update-user/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["subadmin", "employee", "getUserById", "owner"],
    }),
    getUsers: build.query({
      query: ({ cp, filter, search, role, parentId }) =>
        `users/get-users?page=${++cp}${filter ? `&filter=${filter}` : ""}${
          search ? `&search=${search}` : ""
        }${role ? `&role=${role}` : ""}&user_id=${parentId}`,
      providesTags: ["owner", "employee"],
    }),
    getUsersByAdmin: build.query({
      query: ({ cp, filter, search, role, parentId }) =>
        `users/get-users-by-admin?page=${++cp}${
          filter ? `&filter=${filter}` : ""
        }${search ? `&search=${search}` : ""}${
          role ? `&role=${role}` : ""
        }&user_id=${parentId}`,
      providesTags: ["owner", "employee"],
    }),
    getOwnByAdmin: build.query({
      query: ({ cp, filter, search }) =>
        `users/get-owners-by-admin?page=${++cp}${
          filter ? `&filter=${filter}` : ""
        }${search ? `&search=${search}` : ""}`,
      providesTags: ["owner"],
    }),
  }),
});

export const {
  useAddSubAdminMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useGetOwnByAdminQuery,
  useUpdateUserMutation,
  useGetUsersByAdminQuery,
} = slsAPI;
