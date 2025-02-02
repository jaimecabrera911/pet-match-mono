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
        });

        // Handle 401 specifically
        if (response.status === 401) {
          console.log("[Auth Client] Usuario no autenticado");
          return null;
        }

        // Check if response is ok before trying to parse JSON
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        // Verify content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("[Auth Client] Respuesta no es JSON:", contentType);
          throw new Error("La respuesta del servidor no es JSON");
        }

        const data = await response.json();
        console.log("[Auth Client] Usuario autenticado:", data);
        return data;
      } catch (error) {
        console.error("[Auth Client] Error al verificar sesión:", error);
        throw error;
      }
    },
    retry: 0,
    staleTime: Infinity,
  });

  const login = async (credentials: Pick<InsertUser, "correo" | "password">) => {
    try {
      console.log("[Auth Client] Intentando iniciar sesión");
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON");
      }

      const data: AuthResponse = await response.json();
      console.log("[Auth Client] Login exitoso:", data);

      // Actualizar el caché de React Query con los datos del usuario
      queryClient.setQueryData(["/api/user"], data.user);

      // Redirigir según el rol
      if (data.user.rolNombre === "ADMIN") {
        setLocation("/dashboard");
      } else {
        setLocation("/user/adopciones");
      }

      return {
        ok: true as const,
        user: data.user,
      };
    } catch (error) {
      console.error("[Auth Client] Error en login:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
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
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al registrar usuario");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON");
      }

      const data: AuthResponse = await response.json();
      console.log("[Auth Client] Registro exitoso:", data);
      queryClient.setQueryData(["/api/user"], data.user);

      return {
        ok: true as const,
        user: data.user,
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
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }

      console.log("[Auth Client] Logout exitoso");
      queryClient.setQueryData(["/api/user"], null);
      setLocation("/auth/login");
      return { ok: true as const };
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