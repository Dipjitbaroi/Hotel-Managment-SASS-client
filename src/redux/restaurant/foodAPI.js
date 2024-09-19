import baseAPI from "../baseAPI.js";

const foodAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    foods: build.query({
      query: ({ cp, pp, search }) =>
        `foods/get-foods-by-hotel?limit=${pp}&page=${++cp}${
          search ? `&search=${search}` : ""
        }`,
      providesTags: ["food"],
    }),
    food: build.query({
      query: (id) => `foods/get-food-by-id/${id}`,
      providesTags: ["food"],
    }),
    addFood: build.mutation({
      query: (data) => {
        return {
          url: "foods/add-food",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["food", "category"],
    }),
    deleteFood: build.mutation({
      query: (id) => {
        return {
          url: `foods/delete-food/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["food"],
    }),
    updateFood: build.mutation({
      query: ({ id, data }) => {
        return {
          url: `foods/update-food/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["food"],
    }),
    addOrder: build.mutation({
      query: (data) => {
        return {
          url: "foods/add-order",
          method: "POST",
          body: data,
        };
      },
      providesTags: ["addOrder"],
      invalidatesTags: [
        "food",
        "order",
        "updateOrder",
        "roomPostedBill",
        "bookingInfo",
      ],
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
    orders: build.query({
      query: ({
        current_order,
        cp,
        pp,
        unique_id,
        fromDate,
        toDate,
        roomNumber,
        table_number,
      }) =>
        `foods/get-orders-by-hotel?limit=${pp}&page=${++cp}${
          toDate && fromDate
            ? `&toDate=${toDate || ""}&fromDate=${fromDate || ""}`
            : ""
        }${current_order ? `&current_order=true` : ""}${
          roomNumber ? `&roomNumber=${roomNumber}` : ""
        }${table_number ? `&table_number=${table_number}` : ""}${
          unique_id ? `&unique_id=${unique_id}` : ""
        }`,
      providesTags: ["order"],
    }),
    addTable: build.mutation({
      query: (data) => {
        return {
          url: "tables/add-table",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["food", "room"],
    }),
    getOrderById: build.query({
      query: (id) => `foods/get-order-by-id/${id}`,
      providesTags: ["checkout", "updateOrder"],
    }),
    updateOrder: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `foods/update-order/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      providesTags: ["updateOrder"],
      invalidatesTags: [
        "checkout",
        "order",
        "addOrder",
        "subDashboard",
        "roomPostedBill",
        "getPaymentSource",
      ],
    }),
    getCategory: build.query({
      query: () => "foods/get-food-categories-by-hotel",
      providesTags: ["category"],
    }),
  }),
});

export const {
  useFoodQuery,
  useFoodsQuery,
  useAddFoodMutation,
  useAddOrderMutation,
  useDeleteFoodMutation,
  useUpdateFoodMutation,
  useOrdersQuery,
  useDeleteOrderMutation,
  useAddTableMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useGetCategoryQuery,
} = foodAPI;
