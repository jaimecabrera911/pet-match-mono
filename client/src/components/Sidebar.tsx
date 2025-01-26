import { Link, useLocation } from "wouter";
import { Home, PawPrint, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { 
      icon: Home, 
      label: "Panel de Control", 
      href: "/dashboard",
      description: "Vista general del sistema" 
    },
    { 
      icon: PawPrint, 
      label: "Mascotas", 
      href: "/dashboard/mascotas",
      description: "Gestionar mascotas disponibles" 
    },
    { 
      icon: Heart, 
      label: "Adopciones", 
      href: "/dashboard/adopciones",
      description: "Solicitudes de adopción" 
    },
    { 
      icon: Users, 
      label: "Usuarios", 
      href: "/dashboard/usuarios",
      description: "Gestión de usuarios" 
    }
  ];

  return (
    <aside 
      className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Menú principal"
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5C7F] rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              PetAdopt
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col p-3 rounded-lg transition-colors",
                  "hover:bg-gray-50 group",
                  location === item.href 
                    ? "bg-gray-50 shadow-sm" 
                    : "text-gray-700"
                )}
              >
                <div className="flex items-center">
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      location === item.href 
                        ? "text-[#FF5C7F]" 
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span 
                    className={cn(
                      "ml-3 font-medium",
                      location === item.href 
                        ? "text-gray-900" 
                        : "text-gray-600 group-hover:text-gray-900"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="mt-0.5 ml-8 text-sm text-gray-500">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 mt-auto border-t">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@petadopt.es</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}