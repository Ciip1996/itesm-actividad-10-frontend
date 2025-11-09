import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthService } from "@services/auth.service";
import { supabase } from "@services/supabase";
import type { User, UserRole, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        console.log("🔵 Inicializando autenticación...");

        // Intentar obtener sesión existente
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("✅ Sesión existente encontrada:", session.user.id);

          // Intentar obtener perfil con timeout
          try {
            const profilePromise = AuthService.getUserProfile(session.user.id);
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Timeout obteniendo perfil inicial")),
                2000 // 2 segundos - optimizado para UX
              )
            );

            const profile = (await Promise.race([
              profilePromise,
              timeoutPromise,
            ])) as User;

            setUser(profile);
            console.log("✅ Perfil inicial cargado");
          } catch (profileError) {
            console.warn("⚠️ Error obteniendo perfil, usando fallback");

            // Crear perfil fallback desde metadata
            const userMetadata = session.user.user_metadata || {};
            const fallbackProfile: User = {
              id_usuario: session.user.id,
              nombre:
                userMetadata.nombre ||
                session.user.email?.split("@")[0] ||
                "Usuario",
              apellido: userMetadata.apellido || "",
              telefono: userMetadata.telefono || "",
              rol: (userMetadata.role || "cliente") as UserRole,
              activo: true,
            };

            setUser(fallbackProfile);

            // Intentar crear en DB en background
            (async () => {
              try {
                const { data } = await supabase
                  .from("usuarios")
                  .upsert(fallbackProfile, { onConflict: "id_usuario" })
                  .select()
                  .single();

                if (data) {
                  console.log("✅ Perfil guardado en DB");
                  setUser(data);
                }
              } catch (err) {
                console.warn("⚠️ No se pudo guardar perfil:", err);
              }
            })();
          }
        } else {
          console.log("ℹ️ No hay sesión activa");
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data } = AuthService.onAuthStateChange((profile) => {
      setUser(profile);
      setLoading(false);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("🟢 useAuth.signIn iniciado");
    try {
      console.log("🟢 Llamando a AuthService.signIn...");
      const { user: authUser } = await AuthService.signIn(email, password);
      console.log("🟢 AuthService.signIn completado:", authUser);

      if (!authUser) {
        console.error("❌ No authUser recibido");
        throw new Error("No se pudo autenticar el usuario");
      }

      console.log("✅ Usuario autenticado:", authUser.id);
      console.log("📦 user_metadata:", authUser.user_metadata);

      // Intentar obtener el perfil del usuario con timeout
      try {
        console.log("🟢 Obteniendo perfil de usuario...");

        const profilePromise = AuthService.getUserProfile(authUser.id);
        const timeoutPromise = new Promise(
          (_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout obteniendo perfil")),
              2000
            ) // 2 segundos
        );

        const profile = (await Promise.race([
          profilePromise,
          timeoutPromise,
        ])) as User;

        console.log("✅ Perfil obtenido:", profile);
        setUser(profile);
        console.log("✅ setUser ejecutado con perfil");
      } catch (profileError) {
        console.error(
          "⚠️ Error obteniendo perfil, creando desde metadata:",
          profileError
        );

        // Crear perfil desde user_metadata (sin guardar en DB)
        const userMetadata = authUser.user_metadata || {};
        const fallbackProfile: User = {
          id_usuario: authUser.id,
          nombre:
            userMetadata.nombre || authUser.email?.split("@")[0] || "Usuario",
          apellido: userMetadata.apellido || "",
          telefono: userMetadata.telefono || "",
          rol: (userMetadata.role || "cliente") as UserRole,
          activo: true,
        };

        console.log("🟢 Usando perfil fallback:", fallbackProfile);

        // Intentar crear en DB (sin esperar)
        supabase
          .from("usuarios")
          .upsert(fallbackProfile, { onConflict: "id_usuario" })
          .select()
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error(
                "⚠️ No se pudo guardar en DB (continuando):",
                error
              );
            } else {
              console.log("✅ Perfil guardado en DB:", data);
              setUser(data);
            }
          });

        // Usar el perfil fallback inmediatamente
        setUser(fallbackProfile);
        console.log("✅ setUser ejecutado con perfil fallback");
      }
      console.log("✅ signIn completado exitosamente");
    } catch (error) {
      console.error("❌ Error en signIn:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    const { profile } = await AuthService.signUp(email, password, {
      nombre: userData.nombre || "",
      apellido: userData.apellido || "",
      telefono: userData.telefono || "",
      rol: userData.rol,
    });
    setUser(profile);
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
