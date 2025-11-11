import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@hooks/useAuth";
import { LanguageProvider } from "@/i18n";
import { Navbar } from "@/components/organisms";
import { PublicRoute } from "@/components/PublicRoute";
import { Home } from "@pages/Home";
import { Login } from "@pages/Login";
import { Register } from "@pages/Register";
import { AuthCallback } from "@pages/AuthCallback";
import { Reservations } from "@pages/Reservations";
import { NewReservation } from "@pages/NewReservation";
// Admin pages
import { AdminDashboard } from "@pages/AdminDashboard";
import { AdminReservations } from "@pages/AdminReservations";
import { AdminTables } from "@pages/AdminTables";
import { AdminInsights } from "@pages/AdminInsights";
import { AdminLayout } from "@/components/organisms/AdminLayout";
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
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // No need to check loading here because AppRoutes already handles it
  if (!isAuthenticated) {
    // Save the location user was trying to access
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * App Routes Component
 */
const AppRoutes: React.FC = () => {
  const { loading } = useAuth();

  // Show global spinner during initial authentication check
  // Only hide loading when we actually have a decision (user exists or we confirm no session)
  if (loading) {
    return (
      <div className="app__loading">
        <Spinner size="lg" />
      </div>
    );
  }

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
        <Route
          path={ROUTES.AUTH_CALLBACK}
          element={
            <PublicRoute>
              <AuthCallback />
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

        {/* Admin Routes */}
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_RESERVATIONS} element={<AdminReservations />} />
          <Route path={ROUTES.ADMIN_TABLES} element={<AdminTables />} />
          <Route path={ROUTES.ADMIN_INSIGHTS} element={<AdminInsights />} />
        </Route>

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
      <LanguageProvider>
        <AuthProvider>
          <div className="app">
            <AppRoutes />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
