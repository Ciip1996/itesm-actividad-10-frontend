import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@atoms/Button";
import { ROUTES } from "@config/index";
import { useAuth } from "@/hooks";
import "./AdminSidebar.scss";

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    {
      path: ROUTES.ADMIN_DASHBOARD,
      icon: "📊",
      label: "Dashboard",
      description: "Resumen general"
    },
    {
      path: ROUTES.ADMIN_RESERVATIONS,
      icon: "📅",
      label: "Reservas",
      description: "Gestionar reservas"
    },
    {
      path: ROUTES.ADMIN_TABLES,
      icon: "🪑",
      label: "Mesas",
      description: "Configurar mesas"
    },
    {
      path: ROUTES.ADMIN_INSIGHTS,
      icon: "🤖",
      label: "Insights IA",
      description: "Análisis inteligente"
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2 className="admin-sidebar__title">Panel Admin</h2>
        <p className="admin-sidebar__subtitle">Sistema de Reservaciones</p>
      </div>

      <nav className="admin-sidebar__nav">
        <ul className="admin-sidebar__menu">
          {menuItems.map((item) => (
            <li key={item.path} className="admin-sidebar__menu-item">
              <Link
                to={item.path}
                className={`admin-sidebar__menu-link ${
                  location.pathname === item.path ? 'admin-sidebar__menu-link--active' : ''
                }`}
              >
                <span className="admin-sidebar__menu-icon">{item.icon}</span>
                <div className="admin-sidebar__menu-content">
                  <span className="admin-sidebar__menu-label">{item.label}</span>
                  <span className="admin-sidebar__menu-description">{item.description}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__actions">
          <Link to={ROUTES.HOME}>
            <Button variant="secondary" size="sm" fullWidth>
              🏠 Volver al Inicio
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleSignOut}
            className="admin-sidebar__signout"
          >
            🚪 Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};