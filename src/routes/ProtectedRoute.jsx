/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);

  // Check if user is logged in
  if (!user || !user.auth) {
    return <Navigate to="/login" replace />;
  }

  // Get role from token
  const token = user.token;
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload?.role;

    // Check if user has required role
    const hasRequiredRole = allowedRoles.includes(role);
    if (!hasRequiredRole) {
      return <Navigate to="/404" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
