import { useState, useCallback } from "react";
import { ReservationService } from "@services/reservation.service";
import type {
  Reservation,
  CreateReservationDTO,
  AvailabilitySlot,
  CheckAvailabilityDTO,
} from "@/types";
import { getErrorMessage } from "@utils/error.utils";

export const useReservations = (t?: { errors: Record<string, string> }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(
    async (params: CheckAvailabilityDTO): Promise<AvailabilitySlot[]> => {
      setLoading(true);
      setError(null);
      try {
        const slots = await ReservationService.checkAvailability(params);
        return slots;
      } catch (err) {
        const errorMessage = getErrorMessage(err, t);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const createReservation = useCallback(
    async (data: CreateReservationDTO) => {
      setLoading(true);
      setError(null);
      try {
        const result = await ReservationService.createReservation(data);
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err, t);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const getUserReservations = useCallback(
    async (userId: string): Promise<Reservation[]> => {
      setLoading(true);
      setError(null);
      try {
        const reservations = await ReservationService.getUserReservations(
          userId
        );
        return reservations;
      } catch (err) {
        const errorMessage = getErrorMessage(err, t);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const cancelReservation = useCallback(
    async (reservationId: number, motivo?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await ReservationService.cancelReservation(
          reservationId,
          motivo
        );
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err, t);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  return {
    loading,
    error,
    checkAvailability,
    createReservation,
    getUserReservations,
    cancelReservation,
  };
};
