import React from "react";
import { Card } from "@atoms/Card";
import { Badge } from "@atoms/Badge";
import { Button } from "@atoms/Button";
import type { Reservation, ReservationStatus } from "@/types";
import { formatDate, formatTime } from "@utils/date.utils";
import { useLanguage } from "@/i18n";
import "./ReservationCard.scss";

export interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

const getStatusVariant = (status: ReservationStatus) => {
  const variants = {
    confirmada: "success" as const,
    pendiente: "warning" as const,
    cancelada: "error" as const,
  };
  return variants[status] || ("info" as const);
};

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onViewDetails,
}) => {
  const { t } = useLanguage();

  const getStatusLabel = (status: ReservationStatus) => {
    const labels = {
      confirmada: t.reservations.status.confirmed,
      pendiente: t.reservations.status.pending,
      cancelada: t.reservations.status.cancelled,
    };
    return labels[status] || status;
  };

  return (
    <Card className="reservation-card" padding="md" shadow="sm" hover>
      <div className="reservation-card__header">
        <div>
          <h3 className="reservation-card__folio">
            {t.reservations.folio}: {reservation.folio}
          </h3>
          <p className="reservation-card__date">
            {formatDate(reservation.fecha)} - {formatTime(reservation.hora)}
          </p>
        </div>
        <Badge variant={getStatusVariant(reservation.estado)}>
          {getStatusLabel(reservation.estado)}
        </Badge>
      </div>

      <div className="reservation-card__body">
        <div className="reservation-card__info">
          <span className="reservation-card__label">
            {t.reservations.guests}:
          </span>
          <span className="reservation-card__value">
            {reservation.personas}
          </span>
        </div>
        {reservation.notas && (
          <div className="reservation-card__info">
            <span className="reservation-card__label">
              {t.newReservation.notes}:
            </span>
            <span className="reservation-card__value">{reservation.notas}</span>
          </div>
        )}
      </div>

      <div className="reservation-card__actions">
        {onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(reservation.id_reserva)}
          >
            {t.reservations.viewDetails}
          </Button>
        )}
        {onCancel && reservation.estado !== "cancelada" && (
          <Button
            variant="error"
            size="sm"
            onClick={() => onCancel(reservation.id_reserva)}
          >
            {t.reservations.cancelButton}
          </Button>
        )}
      </div>
    </Card>
  );
};
