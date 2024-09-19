import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { token } = useSelector((store) => store.authSlice);
  
  return token ? (
    children
  ) : (
    <Navigate to="/" state={{ fromURL: location }}></Navigate>
  );
};

export default PrivateRoute;
