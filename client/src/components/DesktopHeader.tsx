import { Link, useLocation } from "wouter";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DesktopHeader() {
  const [location] = useLocation();
  
  // Map routes to Spanish titles
  const routeTitles: Record<string, string> = {
    "/": "Panel de Control",
    "/dashboard": "Panel de Control",
    "/mascotas": "Gestión de Mascotas",
    "/adopciones": "Proceso de Adopción",
    "/usuarios": "Gestión de Usuarios"
  };

  const currentTitle = routeTitles[location] || "Panel de Control";

  return (
    <header className="h-16 border-b bg-white px-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="w-96">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar mascotas, usuarios o adopciones..."
              className="pl-9 bg-gray-50"
            />
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Ver notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
