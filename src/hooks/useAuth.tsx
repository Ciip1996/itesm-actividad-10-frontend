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
        // Try to get existing session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          // Try to get profile with timeout
          try {
            const profilePromise = AuthService.getUserProfile(session.user.id);
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Timeout getting initial profile")),
                2000 // 2 seconds - optimized for UX
              )
            );

            const profile = (await Promise.race([
              profilePromise,
              timeoutPromise,
            ])) as User;

            if (!mounted) return;

            // Update user and loading in the same render cycle
            setUser(profile);
            setLoading(false);
          } catch (profileError) {
            if (!mounted) return;

            // Create fallback profile from metadata
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

            // Update user and loading in the same render cycle
            setUser(fallbackProfile);
            setLoading(false);

            // Try to create in DB in background
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
                // Ignore errors in background
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
        throw new Error("Could not authenticate user");
      }

      // Try to get user profile with timeout
      try {
        const profilePromise = AuthService.getUserProfile(authUser.id);
        const timeoutPromise = new Promise(
          (_, reject) =>
            setTimeout(
              () => reject(new Error("Timeout getting profile")),
              2000
            ) // 2 seconds
        );

        const profile = (await Promise.race([
          profilePromise,
          timeoutPromise,
        ])) as User;

        setUser(profile);
      } catch (profileError) {
        // Create profile from user_metadata (without saving to DB)
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

        // Try to create in DB (without waiting)
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

        // Use fallback profile immediately
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
