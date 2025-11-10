import React, { useState, useEffect } from "react";
import { Card } from "@atoms/Card";
import { Spinner } from "@atoms/Spinner";
import { Alert } from "@atoms/Alert";
import { useAdmin } from "@hooks/useAdmin";
import { useLanguage } from "@/i18n";
import "./AdminDashboard.scss";

export interface DashboardStats {
  today: {
    fecha: string;
    total_reservas: number;
    reservas_confirmadas: number;
    reservas_pendientes: number;
    reservas_canceladas: number;
    total_personas: number;
  };
  weekly: {
    total_reservas: number;
    reservas_confirmadas: number;
    reservas_canceladas: number;
    total_personas: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { getDashboardStats, loading, error } = useAdmin();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }
    };

    loadStats();
  }, [getDashboardStats]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="admin-dashboard__loading">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <Alert variant="error">{error}</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">Panel de Administración</h1>
          <p className="admin-dashboard__subtitle">Resumen de actividad del restaurante</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {stats && (
          <>
            {/* KPIs Section */}
            <div className="admin-dashboard__kpis">
              <Card className="admin-dashboard__kpi" padding="md">
                <div className="admin-dashboard__kpi-content">
                  <div className="admin-dashboard__kpi-icon">📅</div>
                  <div className="admin-dashboard__kpi-info">
                    <h3 className="admin-dashboard__kpi-title">Reservas Hoy</h3>
                    <p className="admin-dashboard__kpi-value">{stats.today.total_reservas}</p>
                  </div>
                </div>
              </Card>

              <Card className="admin-dashboard__kpi" padding="md">
                <div className="admin-dashboard__kpi-content">
                  <div className="admin-dashboard__kpi-icon">👥</div>
                  <div className="admin-dashboard__kpi-info">
                    <h3 className="admin-dashboard__kpi-title">Comensales Esperados</h3>
                    <p className="admin-dashboard__kpi-value">{stats.today.total_personas}</p>
                  </div>
                </div>
              </Card>

              <Card className="admin-dashboard__kpi" padding="md">
                <div className="admin-dashboard__kpi-content">
                  <div className="admin-dashboard__kpi-icon">✅</div>
                  <div className="admin-dashboard__kpi-info">
                    <h3 className="admin-dashboard__kpi-title">Confirmadas</h3>
                    <p className="admin-dashboard__kpi-value">{stats.today.reservas_confirmadas}</p>
                  </div>
                </div>
              </Card>

              <Card className="admin-dashboard__kpi" padding="md">
                <div className="admin-dashboard__kpi-content">
                  <div className="admin-dashboard__kpi-icon">⏳</div>
                  <div className="admin-dashboard__kpi-info">
                    <h3 className="admin-dashboard__kpi-title">Pendientes</h3>
                    <p className="admin-dashboard__kpi-value">{stats.today.reservas_pendientes}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section - Simplified without Chart.js */}
            <div className="admin-dashboard__charts">
              <Card className="admin-dashboard__chart" padding="lg">
                <h3 className="admin-dashboard__chart-title">Estado de Reservas Hoy</h3>
                <div className="admin-dashboard__chart-placeholder">
                  <div className="admin-dashboard__chart-stats">
                    <div className="admin-dashboard__chart-stat">
                      <span className="admin-dashboard__chart-label">Confirmadas</span>
                      <span className="admin-dashboard__chart-value" style={{color: '#10B981'}}>
                        {stats.today.reservas_confirmadas}
                      </span>
                    </div>
                    <div className="admin-dashboard__chart-stat">
                      <span className="admin-dashboard__chart-label">Pendientes</span>
                      <span className="admin-dashboard__chart-value" style={{color: '#F59E0B'}}>
                        {stats.today.reservas_pendientes}
                      </span>
                    </div>
                    <div className="admin-dashboard__chart-stat">
                      <span className="admin-dashboard__chart-label">Canceladas</span>
                      <span className="admin-dashboard__chart-value" style={{color: '#EF4444'}}>
                        {stats.today.reservas_canceladas}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="admin-dashboard__chart" padding="lg">
                <h3 className="admin-dashboard__chart-title">Comparación Semanal</h3>
                <div className="admin-dashboard__chart-placeholder">
                  <div className="admin-dashboard__weekly-comparison">
                    <div className="admin-dashboard__week-stat">
                      <span className="admin-dashboard__week-label">Esta Semana</span>
                      <span className="admin-dashboard__week-value">{stats.weekly.total_reservas} reservas</span>
                    </div>
                    <div className="admin-dashboard__week-stat">
                      <span className="admin-dashboard__week-label">Confirmaciones</span>
                      <span className="admin-dashboard__week-value">{stats.weekly.reservas_confirmadas}</span>
                    </div>
                    <div className="admin-dashboard__week-stat">
                      <span className="admin-dashboard__week-label">Cancelaciones</span>
                      <span className="admin-dashboard__week-value">{stats.weekly.reservas_canceladas}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="admin-dashboard__activity" padding="lg">
              <h3 className="admin-dashboard__activity-title">Actividad Reciente</h3>
              <div className="admin-dashboard__activity-stats">
                <div className="admin-dashboard__activity-stat">
                  <span className="admin-dashboard__activity-label">Esta Semana:</span>
                  <span className="admin-dashboard__activity-value">{stats.weekly.total_reservas} reservas</span>
                </div>
                <div className="admin-dashboard__activity-stat">
                  <span className="admin-dashboard__activity-label">Confirmaciones:</span>
                  <span className="admin-dashboard__activity-value">{stats.weekly.reservas_confirmadas}</span>
                </div>
                <div className="admin-dashboard__activity-stat">
                  <span className="admin-dashboard__activity-label">Cancelaciones:</span>
                  <span className="admin-dashboard__activity-value">{stats.weekly.reservas_canceladas}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};