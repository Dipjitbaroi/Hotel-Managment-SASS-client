import baseAPI from "../baseAPI.js";

const barAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addBar: build.mutation({
      query: (data) => {
        return {
          url: "bar/add-bar-order",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["bar"],
    }),
    addOrder: build.mutation({
      query: (data) => {
        return {
          url: "foods/add-order",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["food"],
    }),
    deleteBarOrder: build.mutation({
      query: (id) => {
        return {
          url: `bar/delete-bar-order/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["order"],
    }),
    ordersBar: build.query({
      query: ({ id, cp, pp, search }) =>
        `bar/get-bar-orders-by-hotel/${id}?limit=${pp}&page=${++cp}${
          search ? `&search=${search}` : ""
        }`,
      providesTags: ["order", "bar"],
    }),
  }),
});

export const {
  useFoodQuery,
  useFoodsQuery,
  useAddBarMutation,
  useAddOrderMutation,
  useDeleteBarOrderMutation,
  useUpdateFoodMutation,
  useOrdersBarQuery,
  useDeleteOrderMutation,
} = barAPI;
