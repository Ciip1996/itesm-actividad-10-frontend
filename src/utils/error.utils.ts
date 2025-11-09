import type { APIError } from "@/types";

// Mapping of English error messages to translation keys
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
 * Get a user-friendly error message using i18n
 * Note: This function should be called from components that have access to useLanguage
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
    return t?.errors.unexpected || "Unexpected error. Please try again.";
  }

  // If we have translations available, use them
  if (t) {
    const errorKey = ERROR_KEY_MAP[errorMessage];
    if (errorKey && t.errors[errorKey]) {
      return t.errors[errorKey];
    }
  }

  // Fallback to direct message or generic
  return (
    errorMessage ||
    t?.errors.unexpected ||
    "Unexpected error. Please try again."
  );
};

/**
 * Check if error is an API error
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
 * Handle error and return message
 * @deprecated Use getErrorMessage with translations from components with useLanguage
 */
export const handleError = (error: unknown): string => {
  return getErrorMessage(error);
};
