import React from "react";
import { Card } from "@atoms/Card";
import { Badge } from "@atoms/Badge";
import { Button } from "@atoms/Button";
import type { Reservation, ReservationStatus } from "@/types";
import { formatDate, formatTime } from "@utils/date.utils";
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

const getStatusLabel = (status: ReservationStatus) => {
  const labels = {
    confirmada: "Confirmada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
  };
  return labels[status] || status;
};

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onViewDetails,
}) => {
  return (
    <Card className="reservation-card" padding="md" shadow="sm" hover>
      <div className="reservation-card__header">
        <div>
          <h3 className="reservation-card__folio">
            Folio: {reservation.folio}
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
          <span className="reservation-card__label">Personas:</span>
          <span className="reservation-card__value">
            {reservation.personas}
          </span>
        </div>
        {reservation.notas && (
          <div className="reservation-card__info">
            <span className="reservation-card__label">Notas:</span>
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
            Ver detalles
          </Button>
        )}
        {onCancel && reservation.estado !== "cancelada" && (
          <Button
            variant="error"
            size="sm"
            onClick={() => onCancel(reservation.id_reserva)}
          >
            Cancelar
          </Button>
        )}
      </div>
    </Card>
  );
};
