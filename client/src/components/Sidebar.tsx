import { Link } from "wouter";
import { Home, PawPrint, Heart, Users } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="space-y-2">
          <Link href="/dashboard">
            <a className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
              <Home className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Dashboard</span>
            </a>
          </Link>
          <Link href="/mascotas">
            <a className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
              <PawPrint className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Mascotas</span>
            </a>
          </Link>
          <Link href="/adopciones">
            <a className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
              <Heart className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Adopciones</span>
            </a>
          </Link>
          <Link href="/usuarios">
            <a className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
              <Users className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Usuarios</span>
            </a>
          </Link>
        </div>
      </div>
    </aside>
  );
}
