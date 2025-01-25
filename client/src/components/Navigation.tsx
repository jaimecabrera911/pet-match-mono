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
    <nav className="w-full bg-white border-b py-2 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          </div>
          <div className="flex gap-6">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={cn(
                  "flex flex-col items-center text-sm text-gray-500 hover:text-primary transition-colors",
                  "focus:outline-none"
                )}
              >
                <item.icon className="h-4 w-4 mb-0.5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}