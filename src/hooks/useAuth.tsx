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
    let mounted = true;

    // Check for existing session
    const initAuth = async () => {
      try {
        // Intentar obtener sesión existente
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
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

            if (!mounted) return;

            // Actualizar user y loading en el mismo ciclo de render
            setUser(profile);
            setLoading(false);
          } catch (profileError) {
            if (!mounted) return;

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

            // Actualizar user y loading en el mismo ciclo de render
            setUser(fallbackProfile);
            setLoading(false);

            // Intentar crear en DB en background
            (async () => {
              try {
                const { data } = await supabase
                  .from("usuarios")
                  .upsert(fallbackProfile, { onConflict: "id_usuario" })
                  .select()
                  .single();

                if (data && mounted) {
                  setUser(data);
                }
              } catch (err) {
                // Ignorar errores en background
              }
            })();
          }
        } else {
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data } = AuthService.onAuthStateChange((profile) => {
      if (mounted) {
        setUser(profile);
      }
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser } = await AuthService.signIn(email, password);

      if (!authUser) {
        throw new Error("No se pudo autenticar el usuario");
      }

      // Intentar obtener el perfil del usuario con timeout
      try {
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

        setUser(profile);
      } catch (profileError) {
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

        // Intentar crear en DB (sin esperar)
        supabase
          .from("usuarios")
          .upsert(fallbackProfile, { onConflict: "id_usuario" })
          .select()
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUser(data);
            }
          });

        // Usar el perfil fallback inmediatamente
        setUser(fallbackProfile);
      }
    } catch (error) {
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
