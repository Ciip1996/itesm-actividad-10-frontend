import React, { useState, useEffect } from "react";
import { Card } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Input } from "@atoms/Input";
import { Spinner } from "@atoms/Spinner";
import { Alert } from "@atoms/Alert";
import { Modal } from "@atoms/Modal";
import { useAdmin } from "@hooks/useAdmin";
import { useLanguage } from "@/i18n";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./AdminReservations.scss";

interface Reservation {
  id_reserva: number;
  fecha: string;
  hora: string;
  personas: number;
  estado: string;
  nombre_invitado?: string;
  email_invitado: string;
  telefono_invitado?: string;
  folio: string;
  notas?: string;
  created_at: string;
}

export const AdminReservations: React.FC = () => {
  const { t } = useLanguage();
  const { getAllReservations, updateReservation, loading, error } = useAdmin();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState({
    fecha_desde: "",
    fecha_hasta: "",
    estado: "",
    busqueda: ""
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updateData, setUpdateData] = useState({ estado: "" });

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reservations, filters]);

  const loadReservations = async () => {
    try {
      const data = await getAllReservations();
      setReservations(data || []);
    } catch (err) {
      console.error('Error loading reservations:', err);
    }
  };

  const applyFilters = () => {
    try {
      let filtered = [...reservations];

      if (filters.fecha_desde) {
        filtered = filtered.filter(r => r.fecha >= filters.fecha_desde);
      }

      if (filters.fecha_hasta) {
        filtered = filtered.filter(r => r.fecha <= filters.fecha_hasta);
      }

      if (filters.estado) {
        filtered = filtered.filter(r => r.estado === filters.estado);
      }

      if (filters.busqueda) {
        const search = filters.busqueda.toLowerCase();
        filtered = filtered.filter(r => 
          (r.folio || '').toLowerCase().includes(search) ||
          (r.nombre_invitado || '').toLowerCase().includes(search) ||
          (r.email_invitado || '').toLowerCase().includes(search)
        );
      }

      setFilteredReservations(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredReservations(reservations);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setUpdateData({ estado: reservation.estado });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedReservation) return;

    try {
      await updateReservation(selectedReservation.id_reserva, updateData);
      await loadReservations();
      setShowUpdateModal(false);
      setSelectedReservation(null);
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  if (loading) {
    return (
      <div className="admin-reservations">
        <div className="container">
          <div className="admin-reservations__loading">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reservations">
      <div className="container">
        <div className="admin-reservations__header">
          <h1 className="admin-reservations__title">Gestión de Reservas</h1>
          <p className="admin-reservations__subtitle">Administra todas las reservas del restaurante</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Filters */}
        <Card className="admin-reservations__filters" padding="md">
          <h3 className="admin-reservations__filters-title">Filtros</h3>
          <div className="admin-reservations__filters-grid">
            <div className="admin-reservations__filter-group">
              <label className="admin-reservations__filter-label">Fecha Desde</label>
              <Input
                type="date"
                name="fecha_desde"
                value={filters.fecha_desde}
                onChange={handleFilterChange}
              />
            </div>
            <div className="admin-reservations__filter-group">
              <label className="admin-reservations__filter-label">Fecha Hasta</label>
              <Input
                type="date"
                name="fecha_hasta"
                value={filters.fecha_hasta}
                onChange={handleFilterChange}
              />
            </div>
            <div className="admin-reservations__filter-group">
              <label className="admin-reservations__filter-label">Estado</label>
              <select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="admin-reservations__filter-select"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div className="admin-reservations__filter-group">
              <label className="admin-reservations__filter-label">Buscar</label>
              <Input
                type="text"
                name="busqueda"
                value={filters.busqueda}
                onChange={handleFilterChange}
                placeholder="Folio, nombre o email"
              />
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="admin-reservations__summary">
          <p>Mostrando {filteredReservations.length} de {reservations.length} reservas</p>
        </div>

        {/* Reservations Table */}
        <Card className="admin-reservations__table" padding="md">
          <div className="admin-reservations__table-container">
            <table className="admin-reservations__table-element">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Personas</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id_reserva}>
                    <td>
                      <span className="admin-reservations__folio">{reservation.folio}</span>
                    </td>
                    <td>
                      {format(new Date(reservation.fecha), 'dd/MM/yyyy', { locale: es })}
                    </td>
                    <td>
                      {reservation.hora}
                    </td>
                    <td>
                      {reservation.personas}
                    </td>
                    <td>
                      <div className="admin-reservations__client-info">
                        <div className="admin-reservations__client-name">
                          {reservation.nombre_invitado || 'N/A'}
                        </div>
                        <div className="admin-reservations__client-email">
                          {reservation.email_invitado}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-reservations__status admin-reservations__status--${getStatusColor(reservation.estado)}`}>
                        {getStatusText(reservation.estado)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-reservations__actions">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateClick(reservation)}
                        >
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Update Modal */}
        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onConfirm={handleUpdateSubmit}
          title="Actualizar Reserva"
          confirmText="Actualizar"
        >
          {selectedReservation && (
            <div className="admin-reservations__update-form">
              <div className="admin-reservations__reservation-details">
                <h4>Detalles de la Reserva</h4>
                <p><strong>Folio:</strong> {selectedReservation.folio}</p>
                <p><strong>Fecha:</strong> {format(new Date(selectedReservation.fecha), 'dd/MM/yyyy')}</p>
                <p><strong>Hora:</strong> {selectedReservation.hora}</p>
                <p><strong>Personas:</strong> {selectedReservation.personas}</p>
                <p><strong>Cliente:</strong> {selectedReservation.nombre_invitado || 'N/A'}</p>
              </div>
              <div className="admin-reservations__status-update">
                <label className="admin-reservations__update-label">Estado</label>
                <select
                  value={updateData.estado}
                  onChange={(e) => setUpdateData({ estado: e.target.value })}
                  className="admin-reservations__status-select"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};