import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@config/index";

/**
 * Cliente de Supabase singleton
 */
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: "supabase.auth.token",
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-client-info": "supabase-js-web",
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
