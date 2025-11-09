import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@atoms/Card";
import { Spinner } from "@atoms/Spinner";
import { Alert } from "@atoms/Alert";
import { ReservationCard } from "@molecules/ReservationCard";
import { useAuth } from "@hooks/useAuth";
import { useReservations } from "@hooks/useReservations";
import type { Reservation } from "@/types";
import { useLanguage } from "@/i18n";
import "./Reservations.scss";

export const Reservations: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getUserReservations, cancelReservation, loading, error } =
    useReservations(t);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getUserReservations(user.id_usuario);
      setReservations(data);
    } catch (err) {
      // Error handled by hook
    }
  }, [user, getUserReservations]);

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user, loadReservations]);

  const handleCancel = async (id: number) => {
    if (!confirm(t.reservations.confirmCancel)) return;

    try {
      await cancelReservation(id);
      await loadReservations();
    } catch (err) {
      setCancelError(t.reservations.cancelError);
    }
  };

  if (loading) {
    return (
      <div className="reservations">
        <div className="container">
          <div className="reservations__loading">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations">
      <div className="container">
        <div className="reservations__header">
          <h1 className="reservations__title">{t.reservations.title}</h1>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {cancelError && (
          <Alert variant="error" onClose={() => setCancelError(null)}>
            {cancelError}
          </Alert>
        )}

        {reservations.length === 0 ? (
          <Card padding="lg">
            <div className="reservations__empty">
              <p>{t.reservations.empty}</p>
            </div>
          </Card>
        ) : (
          <div className="reservations__list">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id_reserva}
                reservation={reservation}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
