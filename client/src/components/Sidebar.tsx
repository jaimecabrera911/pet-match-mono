import { Link } from "wouter";
import { Home, PawPrint, Heart, Users } from "lucide-react";

export function Sidebar() {
  return (
    <aside 
      className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200"
      role="navigation"
      aria-label="Menú principal"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <nav className="space-y-2">
          <Link 
            href="/dashboard"
            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            role="menuitem"
            aria-label="Ir al Panel de Control"
          >
            <Home 
              className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" 
              aria-hidden="true"
            />
            <span className="ml-3">Dashboard</span>
          </Link>
          <Link 
            href="/mascotas"
            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            role="menuitem"
            aria-label="Ir a la sección de Mascotas"
          >
            <PawPrint 
              className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" 
              aria-hidden="true"
            />
            <span className="ml-3">Mascotas</span>
          </Link>
          <Link 
            href="/adopciones"
            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            role="menuitem"
            aria-label="Ir a la sección de Adopciones"
          >
            <Heart 
              className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" 
              aria-hidden="true"
            />
            <span className="ml-3">Adopciones</span>
          </Link>
          <Link 
            href="/usuarios"
            className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            role="menuitem"
            aria-label="Ir a la sección de Usuarios"
          >
            <Users 
              className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" 
              aria-hidden="true"
            />
            <span className="ml-3">Usuarios</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}