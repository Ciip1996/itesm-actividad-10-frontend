import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@atoms/Card";
import { Spinner } from "@atoms/Spinner";
import { Alert } from "@atoms/Alert";
import { Modal } from "@atoms/Modal";
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancelClick = (id: number) => {
    setReservationToCancel(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (reservationToCancel === null) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelReservation(reservationToCancel, "Cancelled by user");
      await loadReservations();
      setShowCancelModal(false);
      setReservationToCancel(null);
    } catch (err) {
      setCancelError(t.reservations.cancelError);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancelModal = () => {
    if (!isCancelling) {
      setShowCancelModal(false);
      setReservationToCancel(null);
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
                onCancel={handleCancelClick}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={showCancelModal}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
          title={t.reservations.cancelModalTitle}
          confirmText={t.reservations.cancelModalConfirm}
          cancelText={t.reservations.cancelModalCancel}
          variant="danger"
          loading={isCancelling}
        >
          <p>{t.reservations.cancelModalMessage}</p>
        </Modal>
      </div>
    </div>
  );
};
