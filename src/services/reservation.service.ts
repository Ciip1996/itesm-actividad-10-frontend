import { SUPABASE_CONFIG } from "@config/index";
import type {
  CheckAvailabilityDTO,
  CreateReservationDTO,
  AvailabilitySlot,
  Reservation,
} from "@/types";

// Type for backend response
interface BackendAvailabilitySlot {
  hora: string;
  turno: string;
  mesas_disponibles: number;
}

/**
 * Reservation service
 */
export class ReservationService {
  private static readonly BASE_URL = `${SUPABASE_CONFIG.url}/functions/v1`;

  /**
   * Get current session token from authenticated user
   */
  private static async getAuthToken(): Promise<string> {
    const { supabase } = await import("./supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If there's an active session, use the user's token
    // If not, use the anon key (for public endpoints)
    return session?.access_token || SUPABASE_CONFIG.anonKey;
  }

  /**
   * Verificar disponibilidad de horarios
   */
  static async checkAvailability(
    params: CheckAvailabilityDTO
  ): Promise<AvailabilitySlot[]> {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.BASE_URL}/buscar-disponibilidad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fecha: params.fecha,
        numero_personas: params.numero_personas,
      }),
    });

    if (!response.ok) {
      await response.text();
      throw new Error("Error checking availability");
    }

    const result = await response.json();

    // The API returns horarios_disponibles, not disponibles
    if (result.data?.horarios_disponibles) {
      // Transform backend structure to frontend expected format
      return result.data.horarios_disponibles.map(
        (slot: BackendAvailabilitySlot) => ({
          hora: slot.hora,
          disponible: slot.mesas_disponibles > 0,
          mesas_disponibles: slot.mesas_disponibles,
          turno: slot.turno,
        })
      );
    }

    return [];
  }

  /**
   * Create new reservation
   */
  static async createReservation(data: CreateReservationDTO) {
    const token = await this.getAuthToken();

    const response = await fetch(`${this.BASE_URL}/crear-reserva`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Extract more specific error message
      const errorMessage =
        errorData.error?.message ||
        errorData.message ||
        "Error creating reservation";
      throw new Error(errorMessage);
    }

    const result = await response.json();

    return result.data;
  }

  /**
   * Obtener reservaciones del usuario
   */
  static async getUserReservations(userId: string): Promise<Reservation[]> {
    try {
      const { supabase } = await import("./supabase");

      const queryPromise = supabase
        .from("reservas")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha", { ascending: false });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout getting reservations")),
          5000
        )
      );

      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise,
      ]);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      // Return empty array on error
      return [];
    }
  }

  /**
   * Obtener reservación por ID
   */
  static async getReservationById(id: number): Promise<Reservation> {
    const { supabase } = await import("./supabase");

    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("id_reserva", id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Obtener reservación por folio
   */
  static async getReservationByFolio(folio: string): Promise<Reservation> {
    const { supabase } = await import("./supabase");

    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("folio", folio)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Cancelar reservación
   */
  static async cancelReservation(
    reservationId: number,
    motivo?: string
  ): Promise<Reservation> {
    const { supabase } = await import("./supabase");

    const updatePromise = supabase
      .from("reservas")
      .update({
        estado: "cancelada",
        motivo_cancelacion: motivo,
      })
      .eq("id_reserva", reservationId)
      .select()
      .single();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout canceling reservation")),
        5000
      )
    );

    const { data, error } = await Promise.race([updatePromise, timeoutPromise]);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Actualizar estado de reservación
   */
  static async updateReservationStatus(
    reservationId: number,
    estado: "pendiente" | "confirmada" | "cancelada"
  ): Promise<Reservation> {
    const { supabase } = await import("./supabase");

    const { data, error } = await supabase
      .from("reservas")
      .update({ estado })
      .eq("id_reserva", reservationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
