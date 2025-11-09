/**
 * Utilidades de seguridad para la aplicación
 */

import { supabase } from "@/services/supabase";

/**
 * Validar si la sesión actual es válida y no ha expirado
 */
export const validateSession = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return false;
    }

    // Check if token hasn't expired
    const expiresAt = session.expires_at;
    if (!expiresAt) return false;

    const now = Math.floor(Date.now() / 1000);
    const isExpired = now >= expiresAt;

    return !isExpired;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitizar input de usuario para prevenir XSS
 * Nota: React ya hace escape automático, pero esto es una capa adicional
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Prevenir ataques de timing en comparaciones de strings sensibles
 */
export const secureCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

/**
 * Generar nonce para CSP (Content Security Policy)
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

/**
 * Detectar si el navegador tiene características de seguridad básicas
 */
export const checkBrowserSecurity = (): {
  isSecure: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  // Check if on HTTPS (in production)
  if (
    import.meta.env.PROD &&
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost"
  ) {
    issues.push("Application should be served over HTTPS");
  }

  // Check if localStorage is available
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
  } catch (e) {
    issues.push("localStorage is not available");
  }

  // Check if crypto API is available
  if (!window.crypto || !window.crypto.getRandomValues) {
    issues.push("Crypto API is not available");
  }

  return {
    isSecure: issues.length === 0,
    issues,
  };
};

/**
 * Rate limiting simple del lado del cliente
 * Útil para prevenir spam de requests
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  /**
   * Verificar si se puede hacer un request
   * @param key - Identificador único del recurso
   * @param maxRequests - Número máximo de requests permitidos
   * @param windowMs - Ventana de tiempo en milisegundos
   */
  canMakeRequest(
    key: string,
    maxRequests: number = 5,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];

    // Filter timestamps outside the window
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length >= maxRequests) {
      return false;
    }

    // Add new timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    return true;
  }

  /**
   * Limpiar timestamps antiguos
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter((ts) => now - ts < 60000);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Clean up rate limiter every minute
if (typeof window !== "undefined") {
  setInterval(() => rateLimiter.cleanup(), 60000);
}
