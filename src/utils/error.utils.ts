import type { APIError } from "@/types";

/**
 * Mensajes de error por defecto
 */
const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Credenciales de acceso inválidas",
  "Reservation not found": "Reservación no encontrada",
  "Time slot not available": "Horario no disponible",
  "User already registered": "El usuario ya está registrado",
  "Email already exists": "El correo electrónico ya está registrado",
  "Network request failed":
    "Error de conexión. Verifica tu conexión a internet.",
  "Invalid email": "Correo electrónico inválido",
  "Password should be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres",
};

/**
 * Obtener mensaje de error amigable
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return ERROR_MESSAGES[error] || error;
  }

  if (error instanceof Error) {
    return ERROR_MESSAGES[error.message] || error.message;
  }

  if (isAPIError(error)) {
    return ERROR_MESSAGES[error.message] || error.message;
  }

  return "Error inesperado. Intenta nuevamente.";
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
 */
export const handleError = (error: unknown): string => {
  console.error("Error:", error);
  return getErrorMessage(error);
};
