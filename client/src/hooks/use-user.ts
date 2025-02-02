
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error("Error al obtener datos del usuario");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("[Auth Client] Error:", error);
        return null;
      }
    },
    staleTime: Infinity,
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const data: AuthResponse = await response.json();
      queryClient.setQueryData(["/api/user"], data.user);

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

  return {
    user,
    isLoading,
    login,
    isAuthenticated: !!user,
  };
}
