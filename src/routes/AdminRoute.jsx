import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { isUserLoading, user } = useSelector((store) => store.authSlice);

  return !isUserLoading ? (
    user?.role === "admin" || user?.role === "subadmin" ? (
      children
    ) : (
      <Navigate to="/dashboard"></Navigate>
    )
  ) : null;
};

export default AdminRoute;
