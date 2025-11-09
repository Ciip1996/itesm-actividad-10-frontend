/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar teléfono
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ""));
};

/**
 * Validar contraseña
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validar nombre (solo letras y espacios)
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};

/**
 * Validar número de personas
 */
export const isValidGuestCount = (count: number, max = 12): boolean => {
  return count > 0 && count <= max;
};

/**
 * Limpiar teléfono (remover espacios y caracteres especiales)
 */
export const cleanPhone = (phone: string): string => {
  return phone.replace(/[\s()-]/g, "");
};

/**
 * Formatear teléfono para mostrar
 */
export const formatPhone = (phone: string): string => {
  const cleaned = cleanPhone(phone);
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};
