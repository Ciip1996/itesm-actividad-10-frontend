import { supabase } from "./supabase";
import type { User, UserRole } from "@/types";

/**
 * Servicio de autenticación
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

    // Crear o actualizar perfil de usuario (usando upsert por si el trigger ya lo creó)
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
    console.log("🟡 AuthService.signIn - Iniciando con:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("🟡 AuthService.signIn - Respuesta:", { data, error });

    if (error) {
      console.error("❌ AuthService.signIn - Error:", error);
      throw error;
    }

    console.log("✅ AuthService.signIn - Exitoso");
    return data;
  }

  /**
   * Cerrar sesión
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
    console.log("🟡 AuthService.getUserProfile - Buscando userId:", userId);

    try {
      const { data, error } = (await Promise.race([
        supabase.from("usuarios").select("*").eq("id_usuario", userId).single(),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(new Error("Timeout: La consulta tardó más de 5 segundos")),
            5000
          )
        ),
      ])) as any;

      console.log("🟡 AuthService.getUserProfile - Respuesta:", {
        data,
        error,
      });

      if (error) {
        console.error("❌ Error fetching user profile:", error);
        throw new Error(`Error al obtener perfil: ${error.message}`);
      }

      if (!data) {
        console.error("❌ Perfil de usuario no encontrado");
        throw new Error("Perfil de usuario no encontrado");
      }

      console.log("✅ Perfil encontrado:", data);
      return data;
    } catch (err) {
      console.error("❌ Exception en getUserProfile:", err);
      throw err;
    }
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
   * Escuchar cambios de autenticación
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const profile = await this.getUserProfile(session.user.id);
          callback(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}
