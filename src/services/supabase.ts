import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "@config/index";

/**
 * Supabase singleton client with secure configuration
 */
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey,
  {
    auth: {
      // Session persistence configuration
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,

      // Use localStorage to persist sessions (more secure than cookies in this case)
      storage: window.localStorage,

      // Unique key for auth storage
      storageKey: "supabase.auth.token",

      // PKCE (Proof Key for Code Exchange) for enhanced OAuth flow security
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-client-info": "supabase-js-web",
      },
    },
    // Realtime configuration (disabled if not used to save resources)
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Initialize Supabase client
 * Verify configuration and return the client
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
 * Clear session data from local storage
 * Useful for complete logout or data cleanup
 */
export const clearAuthStorage = () => {
  // Clear only Supabase-related keys
  const keysToRemove = Object.keys(localStorage).filter((key) =>
    key.startsWith("supabase.")
  );
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
