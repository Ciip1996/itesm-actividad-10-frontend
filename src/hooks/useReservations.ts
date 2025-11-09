import { useState, useCallback } from "react";
import { ReservationService } from "@services/reservation.service";
import type {
  Reservation,
  CreateReservationDTO,
  AvailabilitySlot,
  CheckAvailabilityDTO,
} from "@/types";
import { handleError } from "@utils/error.utils";

export const useReservations = () => {
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
        const errorMessage = handleError(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createReservation = useCallback(async (data: CreateReservationDTO) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ReservationService.createReservation(data);
      return result;
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
        const errorMessage = handleError(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
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
        const errorMessage = handleError(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
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
