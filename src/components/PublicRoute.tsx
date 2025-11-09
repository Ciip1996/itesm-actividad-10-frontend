import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROUTES } from "@config/index";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas (Login, Register)
 * Redirige a Reservations si el usuario ya está autenticado
 * El estado de loading se maneja globalmente en App.tsx
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to reservations
  if (isAuthenticated) {
    return <Navigate to={ROUTES.RESERVATIONS} replace />;
  }

  return <>{children}</>;
};
