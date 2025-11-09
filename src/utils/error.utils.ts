import type { APIError } from "@/types";

// Mapeo de mensajes de error en inglés a claves de traducción
const ERROR_KEY_MAP: Record<string, string> = {
  "Invalid login credentials": "invalidCredentials",
  "Reservation not found": "reservationNotFound",
  "Time slot not available": "timeSlotNotAvailable",
  "User already registered": "userAlreadyRegistered",
  "Email already exists": "emailAlreadyExists",
  "Network request failed": "networkError",
  "Invalid email": "invalidEmail",
  "Password should be at least 6 characters": "passwordMinLength",
};

/**
 * Obtener mensaje de error amigable usando i18n
 * Nota: Esta función debe ser llamada desde componentes que tengan acceso a useLanguage
 */
export const getErrorMessage = (
  error: unknown,
  t?: { errors: Record<string, string> }
): string => {
  let errorMessage = "";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (isAPIError(error)) {
    errorMessage = error.message;
  } else {
    return t?.errors.unexpected || "Error inesperado. Intenta nuevamente.";
  }

  // Si tenemos traducciones disponibles, usarlas
  if (t) {
    const errorKey = ERROR_KEY_MAP[errorMessage];
    if (errorKey && t.errors[errorKey]) {
      return t.errors[errorKey];
    }
  }

  // Fallback a mensaje directo o genérico
  return (
    errorMessage ||
    t?.errors.unexpected ||
    "Error inesperado. Intenta nuevamente."
  );
};

/**
 * Verificar si es un error de API
 */
export const isAPIError = (error: unknown): error is APIError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as APIError).message === "string"
  );
};

/**
 * Manejar error y retornar mensaje
 * @deprecated Usar getErrorMessage con traducciones desde componentes con useLanguage
 */
export const handleError = (error: unknown): string => {
  return getErrorMessage(error);
};
