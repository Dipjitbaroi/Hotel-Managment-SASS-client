import baseAPI from "../baseAPI.js";

const inventoryAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    inventory: build.query({
      query: ({ id, cp, filter, search }) =>
        `items/get-items-by-hotel/${id}?page=${++cp}${
          filter ? `&filter=${filter}` : ""
        }${search ? `&search=${search}` : ""}`,
      providesTags: ["inventory"],
    }),
    invSingle: build.query({
      query: (id) => `/items/get-item-by-id/${id}`,
      providesTags: ["inventory"],
    }),
    addInventory: build.mutation({
      query: (data) => {
        return {
          url: "items/add-item",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["inventory"],
    }),
    orderInventory: build.mutation({
      query: (data) => {
        return {
          url: "items/assign-items-to-room",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["inventory"],
    }),
    deleteInventory: build.mutation({
      query: (id) => {
        return {
          url: `items/delete-item/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["inventory"],
    }),
    updateInventory: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `items/update-item/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["inventory"],
    }),
  }),
});

export const {
  useInventoryQuery,
  useInvSingleQuery,
    useOrderInventoryMutation,
  useAddInventoryMutation,
  useDeleteInventoryMutation,
  useUpdateInventoryMutation,
} = inventoryAPI;
