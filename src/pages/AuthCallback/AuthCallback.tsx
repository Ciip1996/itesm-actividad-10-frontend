import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@atoms/Spinner";
import { useAuth } from "@hooks/useAuth";
import { ROUTES } from "@config/index";
import "./AuthCallback.scss";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If the user is already authenticated (Google OAuth completed),
    // redirect to the reservations page
    if (isAuthenticated) {
      navigate(ROUTES.RESERVATIONS, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show loading spinner while processing OAuth callback
  return (
    <div className="auth-callback">
      <div className="auth-callback__content">
        <Spinner size="lg" />
        <p className="auth-callback__text">
          Completando autenticación con Google...
        </p>
      </div>
    </div>
  );
};