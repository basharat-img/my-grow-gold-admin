import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/routes";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-muted)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
