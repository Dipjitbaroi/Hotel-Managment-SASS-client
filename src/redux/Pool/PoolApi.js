import baseAPI from "../baseAPI.js";
import store from "../../redux/store.js";

const roomAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // roomNumbers: build.query({
    // 	query: () => `rooms/get-room?only_for_room=true`,
    // 	providesTags: ["room"],
    // }),
    // rooms: build.query({
    // 	query: ({ id, cp, filter, search }) =>
    // 		`rooms/get-rooms-by-hotel/${id}?page=${++cp}${
    // 			filter ? `&filter=${filter}` : ""
    // 		}${search ? `&search=${search}` : ""}`,
    // 	providesTags: ["room"],
    // }),
    // room: build.query({
    // 	query: (id) => `rooms/get-room-by-id/${id}`,
    // 	providesTags: ["room"],
    // }),
    // addRoom: build.mutation({
    // 	query: (data) => {
    // 		return {
    // 			url: "rooms/add-room",
    // 			method: "POST",
    // 			body: data,
    // 		};
    // 	},
    // 	invalidatesTags: ["room"],
    // }),
    // deleteRoom: build.mutation({
    // 	query: (id) => {
    // 		return {
    // 			url: `rooms/delete-room/${id}`,
    // 			method: "DELETE",
    // 		};
    // 	},
    // 	invalidatesTags: ["room"],
    // }),
    // updateRoom: build.mutation({
    // 	query: ({ id, data }) => {
    // 		return {
    // 			url: `rooms/update-room/${id}`,
    // 			method: "PATCH",
    // 			body: data,
    // 		};
    // 	},
    // 	invalidatesTags: ["room"],
    // }),
    addPool: build.mutation({
      query: (data) => {
        return {
          url: "pool/add-pool-bill",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["roomPostedBill", "bookingInfo"],
    }),
  }),
});

export const { useAddPoolMutation } = roomAPI;
