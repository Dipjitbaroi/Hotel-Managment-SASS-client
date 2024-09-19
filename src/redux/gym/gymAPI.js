import baseAPI from "../baseAPI.js";

const gymAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    addGym: build.mutation({
      query: (data) => {
        return {
          url: "gym/add-gym-bill",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["bar","roomPostedBill",'bookingInfo'],
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
    deleteOrder: build.mutation({
      query: (id) => {
        return {
          url: `/foods/delete-order/${id}`,
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
      providesTags: ["order"],
    }),
  }),
});

export const {
  useFoodQuery,
  useFoodsQuery,
  useAddGymMutation,
  useAddOrderMutation,
  useDeleteFoodMutation,
  useUpdateFoodMutation,
  useOrdersBarQuery,
  useDeleteOrderMutation,
} = gymAPI;
