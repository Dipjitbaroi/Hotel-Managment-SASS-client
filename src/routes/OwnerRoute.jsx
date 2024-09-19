import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OwnerRoute = ({ children }) => {
  const { isUserLoading, user } = useSelector((store) => store.authSlice);

  return !isUserLoading ? (
    user?.role === "owner" ? (
      children
    ) : (
      <Navigate to="/dashboard"></Navigate>
    )
  ) : null;
};

export default OwnerRoute;
