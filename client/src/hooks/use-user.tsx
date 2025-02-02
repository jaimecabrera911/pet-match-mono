import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@db/schema";
import { useLocation } from "wouter";

interface AuthResponse {
  message: string;
  user: {
    id: number;
    correo: string;
    nombres: string;
    apellidos: string;
    rolNombre: "USER" | "ADMIN";
  };
}

export function useUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery<AuthResponse["user"]>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        console.log("[Auth Client] Verificando sesión de usuario");
        const response = await fetch("/api/user", {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.status === 401) {
          console.log("[Auth Client] Usuario no autenticado");
          return null;
        }

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          console.log("[Auth Client] No hay datos de usuario");
          return null;
        }

        console.log("[Auth Client] Usuario autenticado:", data);
        return data;
      } catch (error) {
        console.error("[Auth Client] Error al verificar sesión:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    cacheTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });

  const navigateByRole = (user: AuthResponse["user"]) => {
    if (user.rolNombre === "ADMIN") {
      setLocation("/dashboard/panel-de-control");
    } else {
      setLocation("/user/adopciones");
    }
  };

  const login = async (credentials: Pick<InsertUser, "correo" | "password">) => {
    try {
      console.log("[Auth Client] Intentando iniciar sesión");
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Error al iniciar sesión");
      }

      console.log("[Auth Client] Login exitoso:", data);

      // Update cache immediately
      queryClient.setQueryData(["/api/user"], data.user);

      // Navigate based on role
      navigateByRole(data.user);

      return {
        ok: true as const,
        user: data.user,
        message: data.message || "Login exitoso",
      };
    } catch (error) {
      console.error("[Auth Client] Error en login:", error);
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  const register = async (userData: InsertUser) => {
    try {
      console.log("[Auth Client] Intentando registrar usuario");
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Error al registrar usuario");
      }

      console.log("[Auth Client] Registro exitoso:", data);

      // Update cache immediately
      queryClient.setQueryData(["/api/user"], data.user);

      // Navigate based on role
      navigateByRole(data.user);

      return {
        ok: true as const,
        user: data.user,
        message: data.message || "Registro exitoso",
      };
    } catch (error) {
      console.error("[Auth Client] Error en registro:", error);
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  const logout = async () => {
    try {
      console.log("[Auth Client] Intentando cerrar sesión");
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Error al cerrar sesión");
      }

      console.log("[Auth Client] Logout exitoso");

      // Clear user data from cache
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      setLocation("/auth/login");

      return { 
        ok: true as const,
        message: data.message || "Sesión cerrada exitosamente"
      };
    } catch (error) {
      console.error("[Auth Client] Error en logout:", error);
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}