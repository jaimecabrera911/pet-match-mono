import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@db/schema";

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

  const { data: user, isLoading } = useQuery<AuthResponse["user"]>({
    queryKey: ["/api/user"],
    retry: false,
  });

  const login = async (credentials: Pick<InsertUser, "correo" | "password">) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      return {
        ok: true as const,
        user: data.user as AuthResponse["user"],
      };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  const register = async (userData: InsertUser) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      return {
        ok: true as const,
        user: data.user as AuthResponse["user"],
      };
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      return { ok: true as const };
    } catch (error) {
      console.error("Error en logout:", error);
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