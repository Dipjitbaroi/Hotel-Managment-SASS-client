import baseAPI from "../../baseAPI.js";
import store from "../../store.js";
// const { user } = store.getState().authSlice

const queryForAdmin = ({ cp, filter, search, role, parentId }) => {
  const { user } = store.getState().authSlice;
  if (parentId || user?.role === "subadmin") {
    user.role === "subadmin" && (parentId = user._id);

    return `users/get-users?page=${++cp}${filter ? `&filter=${filter}` : ""}${
      search ? `&search=${search}` : ""
    }${role ? `&role=${role}` : ""}&user_id=${parentId}`;
  } else
    return `users/get-owners-by-admin?page=${++cp}${
      filter ? `&filter=${filter}` : ""
    }${search ? `&search=${search}` : ""}`;
};
const ownerListAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    ownerList: build.query({
      query: queryForAdmin,
      providesTags: ["owner"],
    }),
    getTransactionlogs: build.query({
      query: ({ id, fromDate, toDate, cp }) =>
        `/transactions/get-transactionlogs?user_id=${id}&fromDate=${
          fromDate || ""
        }&toDate=${toDate || ""}&page=${++cp}`,
      providesTags: ["transaction_log"],
    }),
    getStatuslogs: build.query({
      query: ({ id, fromDate, toDate, cp }) => {
        fromDate === "null" && (fromDate = "");
        toDate === "null" && (toDate = "");
        return `/status/get-statuslogs?user_id=${id}&fromDate=${
          fromDate || ""
        }&toDate=${toDate || ""}&page=${++cp}`;
      },
      providesTags: ["status_log"],
    }),
  }),
});

export const {
  useOwnerListQuery,
  useGetTransactionlogsQuery,
  useGetStatuslogsQuery,
} = ownerListAPI;
