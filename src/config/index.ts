/**
 * Supabase configuration
 */

// Validate that environment variables are defined
const validateEnvVar = (value: string | undefined, name: string): string => {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. Please check your .env file.`
    );
  }
  return value;
};

export const SUPABASE_CONFIG = {
  url: validateEnvVar(import.meta.env.VITE_SUPABASE_URL, "VITE_SUPABASE_URL"),
  anonKey: validateEnvVar(
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    "VITE_SUPABASE_ANON_KEY"
  ),
} as const;

/**
 * Application configuration
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
 * Application routes
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
  ADMIN_RESERVATIONS: "/admin/reservations",
  ADMIN_TABLES: "/admin/tables",
  ADMIN_INSIGHTS: "/admin/insights",
  PROFILE: "/profile",
} as const;
