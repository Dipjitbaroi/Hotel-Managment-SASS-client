import React from "react";
import { useSelector } from "react-redux";
import UserDashBoard from "../components/UserDashBoard/UserDashBoard.jsx";

const DashboardRoot = () => {
  const { isUserLoading, user } = useSelector((store) => store.authSlice);

  return !isUserLoading ? (
    user?.role === "admin" ? (
      <UserDashBoard />
    ) : user?.role === "owner" ? (
      <UserDashBoard />
    ) : (
      <UserDashBoard />
    )
  ) : null;
};

export default DashboardRoot;
