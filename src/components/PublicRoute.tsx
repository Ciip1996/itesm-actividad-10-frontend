import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROUTES } from "@config/index";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas (Login, Register)
 * Redirige a Home si el usuario ya está autenticado
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // No redirigir mientras carga para evitar flash
  if (loading) {
    return <>{children}</>;
  }

  // Si ya está autenticado, redirigir a reservations
  if (isAuthenticated) {
    return <Navigate to={ROUTES.RESERVATIONS} replace />;
  }

  return <>{children}</>;
};
