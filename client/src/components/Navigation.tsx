import { cn } from "@/lib/utils";
import { Home, Heart, FileText, Phone, Calendar, Settings, HelpCircle } from "lucide-react";

export function Navigation() {
  const navItems = [
    { icon: Home, label: "Inicio" },
    { icon: Heart, label: "Mascotas" },
    { icon: FileText, label: "General" },
    { icon: Phone, label: "Contactar" },
    { icon: Calendar, label: "Calendario" },
    { icon: Settings, label: "Configurar" },
    { icon: HelpCircle, label: "Ayuda" }
  ];

  return (
    <nav className="w-full bg-white py-4 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={cn(
                  "flex flex-col items-center text-sm text-gray-600 hover:text-primary transition-colors",
                  "focus:outline-none"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}