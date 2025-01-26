import { Link } from "wouter";
import { Home, PawPrint, Heart } from "lucide-react";

export function DashboardNav() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 h-16">
          <Link href="/dashboard">
            <a className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/mascotas">
            <a className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
              <PawPrint className="h-5 w-5" />
              <span>Mascotas</span>
            </a>
          </Link>
          <Link href="/adopciones">
            <a className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
              <Heart className="h-5 w-5" />
              <span>Adopciones</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
