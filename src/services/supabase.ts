import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@config/index";

/**
 * Cliente de Supabase singleton con configuración segura
 */
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      // Configuración de persistencia de sesión
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,

      // Usar localStorage para persistir sesiones (más seguro que cookies en este caso)
      storage: window.localStorage,

      // Clave única para el almacenamiento de auth
      storageKey: "supabase.auth.token",

      // PKCE (Proof Key for Code Exchange) para mayor seguridad en el flujo OAuth
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-client-info": "supabase-js-web",
      },
    },
    // Configuración de realtime (deshabilitada si no se usa para ahorrar recursos)
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Inicializar cliente de Supabase
 * Verifica la configuración y retorna el cliente
 */
export const initSupabase = () => {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
    throw new Error(
      "Supabase configuration is missing. Please check your environment variables."
    );
  }
  return supabase;
};

/**
 * Limpiar datos de sesión del almacenamiento local
 * Útil para logout completo o limpieza de datos
 */
export const clearAuthStorage = () => {
  // Limpiar solo las claves relacionadas con Supabase
  const keysToRemove = Object.keys(localStorage).filter((key) =>
    key.startsWith("supabase.")
  );
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
