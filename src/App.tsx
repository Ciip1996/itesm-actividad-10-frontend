import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@hooks/useAuth";
import { Navbar } from "@/components/organisms";
import { PublicRoute } from "@/components/PublicRoute";
import { Home } from "@pages/Home";
import { Login } from "@pages/Login";
import { Register } from "@pages/Register";
import { Reservations } from "@pages/Reservations";
import { NewReservation } from "@pages/NewReservation";
import { Spinner } from "@atoms/Spinner";
import { ROUTES } from "@config/index";
import "./App.scss";

/**
 * Protected Route Component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app__loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardar la ubicación a la que intentaba acceder
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * App Routes Component
 */
const AppRoutes: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />

        {/* Public Routes - Redirigen a /reservations si ya está autenticado */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path={ROUTES.RESERVATIONS}
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.NEW_RESERVATION}
          element={
            <ProtectedRoute>
              <NewReservation />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  );
};

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
