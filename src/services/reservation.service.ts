import { SUPABASE_CONFIG } from "@config/index";
import type {
  CheckAvailabilityDTO,
  CreateReservationDTO,
  AvailabilitySlot,
  Reservation,
} from "@/types";

// Tipo para la respuesta del backend
interface BackendAvailabilitySlot {
  hora: string;
  turno: string;
  mesas_disponibles: number;
}

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
    console.log("📡 Calling checkAvailability with:", params);
    const token = await this.getAuthToken();
    console.log("🔑 Token obtained:", token ? "YES" : "NO");

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

    console.log("📨 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      throw new Error("Error checking availability");
    }

    const result = await response.json();
    console.log("📦 Response data:", result);

    // La API devuelve horarios_disponibles, no disponibles
    if (result.data?.horarios_disponibles) {
      // Transformar la estructura del backend al formato esperado por el frontend
      return result.data.horarios_disponibles.map(
        (slot: BackendAvailabilitySlot) => ({
          hora: slot.hora,
          disponible: slot.mesas_disponibles > 0,
          mesas_disponibles: slot.mesas_disponibles,
          turno: slot.turno,
        })
      );
    }

    console.error("⚠️ Unexpected response structure:", result);
    return [];
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
    try {
      const { supabase } = await import("./supabase");

      const queryPromise = supabase
        .from("reservas")
        .select("*")
        .eq("id_usuario", userId)
        .order("fecha", { ascending: false });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout obteniendo reservaciones")),
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
        () => reject(new Error("Timeout cancelando reservación")),
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
