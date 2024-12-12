/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ allowedEmails }) => {
  const { user } = useContext(UserContext);

  // Check if user is logged in
  if (!user || !user.auth) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required email
  const hasAccess = allowedEmails.includes(user.email);
  if (!hasAccess) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
