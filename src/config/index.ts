/**
 * Configuración de Supabase
 */

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
} as const;

/**
 * Configuración de la aplicación
 */
export const APP_CONFIG = {
  name: "Sistema de Reservaciones",
  defaultPageSize: 10,
  maxReservationDaysAhead: 90,
  minReservationHoursAhead: 2,
  maxGuestsPerReservation: 12,
  reservationTimeSlots: [
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ],
} as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  RESERVATIONS: "/reservations",
  NEW_RESERVATION: "/reservations/new",
  RESERVATION_DETAIL: "/reservations/:id",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_INSIGHTS: "/admin/insights",
  PROFILE: "/profile",
} as const;
