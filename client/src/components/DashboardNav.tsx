import { Link } from "wouter";
import { Home, PawPrint, Heart, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function DashboardNav() {
  const { user } = useAuth();

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      roles: ["admin", "shelter", "adoptante"],
    },
    {
      href: "/dashboard/mascotas",
      label: "Mascotas",
      icon: PawPrint,
      roles: ["admin", "shelter"],
    },
    {
      href: "/dashboard/adopciones",
      label: "Adopciones",
      icon: Heart,
      roles: ["admin", "shelter"],
    },
    {
      href: "/dashboard/usuarios",
      label: "Usuarios",
      icon: Users,
      roles: ["admin"],
    },
  ];

  // Filtrar elementos de navegación según el rol del usuario
  // Verificar la estructura del objeto 'user' para confirmar qué propiedad contiene el rol del usuario.
  console.log("User object:", user); // Añadir un log para saber la estructura del objeto user
  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <nav className="fixed inset-y-0 left-0 w-64 bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link
            href="/dashboard/panel-de-control"
            className="flex items-center gap-2 text-xl font-semibold text-gray-900"
          >
            <img src="/images/logo.jpg" alt="Logo" className="h-20 w-20" />
          </Link>
        </div>
        <div className="flex-1 px-4">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
