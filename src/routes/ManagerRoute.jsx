import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ManagerRoute = ({ children }) => {
  const { isUserLoading, user } = useSelector((store) => store.authSlice);

  return !isUserLoading ? (
    user?.role === "manager" ? (
      children
    ) : (
      <Navigate to="/dashboard"></Navigate>
    )
  ) : null;
};

export default ManagerRoute;
