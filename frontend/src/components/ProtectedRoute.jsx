import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({
  children,
  roleRequired,
  checkProfile,
  userData,
  loading,
}) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded || loading) return <div>Loading...</div>;

  if (!isSignedIn) return <Navigate to="/login" />;

  if (checkProfile && (!userData?.role || !userData?.name)) {
    return <Navigate to="/profile-setup" />;
  }

  if (roleRequired && userData?.role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
