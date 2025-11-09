import { SUPABASE_CONFIG } from "@config/index";
import type {
  CheckAvailabilityDTO,
  CreateReservationDTO,
  AvailabilitySlot,
  Reservation,
} from "@/types";

/**
 * Servicio de reservaciones
 */
export class ReservationService {
  private static readonly BASE_URL = `${SUPABASE_CONFIG.url}/functions/v1`;

  /**
   * Obtener el token de sesión actual del usuario autenticado
   */
  private static async getAuthToken(): Promise<string> {
    const { supabase } = await import("./supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Si hay sesión activa, usar el token del usuario
    // Si no, usar el anon key (para endpoints públicos)
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
      throw new Error("Error checking availability");
    }

    const result = await response.json();
    return result.data.disponibles;
  }

  /**
   * Crear nueva reservación
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
      const error = await response.json();
      throw new Error(error.message || "Error creating reservation");
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Obtener reservaciones del usuario
   */
  static async getUserReservations(userId: string): Promise<Reservation[]> {
    console.log("🟡 ReservationService.getUserReservations - userId:", userId);

    try {
      const { supabase } = await import("./supabase");

      const queryPromise = supabase
        .from("reservas")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha", { ascending: false });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout obteniendo reservaciones")),
          5000
        )
      );

      const { data, error } = (await Promise.race([
        queryPromise,
        timeoutPromise,
      ])) as any;

      console.log("🟡 getUserReservations - Respuesta:", { data, error });

      if (error) {
        console.error("❌ Error obteniendo reservaciones:", error);
        throw error;
      }

      console.log("✅ Reservaciones obtenidas:", data?.length || 0);
      return data || [];
    } catch (err) {
      console.error("❌ Exception en getUserReservations:", err);
      // Retornar array vacío en caso de error
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
    console.log("🟡 ReservationService.cancelReservation - id:", reservationId);

    try {
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

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout cancelando reservación")),
          5000
        )
      );

      const { data, error } = (await Promise.race([
        updatePromise,
        timeoutPromise,
      ])) as any;

      console.log("🟡 cancelReservation - Respuesta:", { data, error });

      if (error) {
        console.error("❌ Error cancelando reservación:", error);
        throw error;
      }

      console.log("✅ Reservación cancelada");
      return data;
    } catch (err) {
      console.error("❌ Exception en cancelReservation:", err);
      throw err;
    }
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
