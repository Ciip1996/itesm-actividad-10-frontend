import { supabase, clearAuthStorage } from "./supabase";
import type { User, UserRole } from "@/types";

/**
 * Servicio de autenticación con mejores prácticas de seguridad
 */
export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  static async signUp(
    email: string,
    password: string,
    userData: {
      nombre: string;
      apellido: string;
      telefono: string;
      rol?: UserRole;
    }
  ) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userData.rol || "cliente",
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    // Create or update user profile (using upsert in case the trigger already created it)
    const { data: profileData, error: profileError } = await supabase
      .from("usuarios")
      .upsert(
        {
          id_usuario: authData.user.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          rol: userData.rol || "cliente",
          activo: true,
        },
        {
          onConflict: "id_usuario",
        }
      )
      .select()
      .single();

    if (profileError) throw profileError;

    return { auth: authData, profile: profileData };
  }

  /**
   * Iniciar sesión
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Sign out
   * Clears both Supabase session and local storage
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      // Always clear local storage, even if there's an error
      clearAuthStorage();
    }
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  /**
   * Obtener perfil de usuario
   */
  static async getUserProfile(userId: string): Promise<User> {
    const { data, error } = await Promise.race([
      supabase.from("usuarios").select("*").eq("id_usuario", userId).single(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: Query took longer than 5 seconds")),
          5000
        )
      ),
    ]);

    if (error) {
      throw new Error(`Error getting profile: ${error.message}`);
    }

    if (!data) {
      throw new Error("Perfil de usuario no encontrado");
    }

    return data;
  }
  /**
   * Actualizar perfil de usuario
   */
  static async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from("usuarios")
      .update(updates)
      .eq("id_usuario", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Listen for authentication changes
   */
  static onAuthStateChange(callback: (user: User | null) => void): {
    data: { subscription: { unsubscribe: () => void } };
  } {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only clear user on explicit SIGNED_OUT event
      if (event === "SIGNED_OUT") {
        callback(null);
        return;
      }

      if (session?.user) {
        try {
          const profile = await this.getUserProfile(session.user.id);
          callback(profile);
        } catch (error) {
          // Don't clear user on profile fetch errors
          // Keep the current session active
          // Only log the error for debugging
          if (import.meta.env.DEV) {
            console.warn(
              "Failed to fetch user profile during auth state change:",
              error
            );
          }
        }
      } else if (event === "INITIAL_SESSION" && !session) {
        // Only clear user on initial load if there's no session
        callback(null);
      }
    });

    return { data };
  }
}
