import { cn } from "@/lib/utils";
import { Home, Heart, Info, Phone, Calendar, Settings, HelpCircle } from "lucide-react";

export function Navigation() {
  const navItems = [
    { icon: Home, label: "Inicio" },
    { icon: Heart, label: "Mascotas" },
    { icon: Info, label: "General" },
    { icon: Phone, label: "Contactar" },
    { icon: Calendar, label: "Calendario" },
    { icon: Settings, label: "Configurar" },
    { icon: HelpCircle, label: "Ayuda" }
  ];

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">PetMatch</span>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={cn(
                  "flex flex-col items-center text-sm text-gray-600 hover:text-primary transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
