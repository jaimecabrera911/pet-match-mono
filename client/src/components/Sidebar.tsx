import { Link, useLocation } from "wouter";
import { Home, PawPrint, Heart, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    {
      icon: Home,
      label: "Panel de Control",
      href: "/dashboard/panel-de-control",
      description: "Vista general del sistema",
      roles: ["admin", "shelter", "adoptante"]
    },
    {
      icon: PawPrint,
      label: "Mascotas",
      href: "/dashboard/mascotas",
      description: "Gestionar mascotas disponibles",
      roles: ["admin", "shelter"]
    },
    {
      icon: PawPrint,
      label: "Mascotas Disponibles",
      href: "/dashboard/available-pets",
      description: "Ver mascotas para adoptar",
      roles: ["adoptante"]
    },
    {
      icon: Heart,
      label: "Adopciones",
      href: "/dashboard/adopciones",
      description: "Solicitudes de adopción",
      roles: ["admin", "shelter"]
    },
    {
      icon: Users,
      label: "Usuarios",
      href: "/dashboard/usuarios",
      description: "Gestión de usuarios",
      roles: ["admin"]
    }
  ];

  // Filtrar elementos de navegación según el rol del usuario
  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync({});
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <Link href="/dashboard/panel-de-control" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-[#FF5C7F]" />
            <span className="text-xl font-semibold">PetMatch</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col p-3 rounded-lg transition-colors",
                  "hover:bg-gray-50",
                  location === item.href
                    ? "bg-gray-50"
                    : "text-gray-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon 
                    className={cn(
                      "h-5 w-5",
                      location === item.href 
                        ? "text-[#FF5C7F]" 
                        : "text-gray-400"
                    )} 
                  />
                  <span className="font-medium text-gray-900">
                    {item.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 ml-8">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 mt-auto border-t">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nombres}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.correo}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}