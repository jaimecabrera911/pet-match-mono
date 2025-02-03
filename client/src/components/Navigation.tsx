import { cn } from "@/lib/utils";
import { Home, Heart, FileText, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const navItems = [
    { icon: Home, label: "Inicio", href: "#hero" },
    { icon: Heart, label: "Mascotas", href: "#mascotas" },
    { icon: FileText, label: "General", href: "#proceso" },
    { icon: Phone, label: "Contactar", href: "#contacto" }
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-100 py-1.5 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#FF5C7F] rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "flex flex-col items-center text-xs text-gray-400 hover:text-[#FF5C7F] transition-colors",
                  "focus:outline-none"
                )}
              >
                <item.icon className="h-3.5 w-3.5 mb-0.5" />
                <span className="text-[9px]">{item.label}</span>
              </a>
            ))}
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#FF5C7F] hover:text-[#FF5C7F] hover:bg-pink-50"
              >
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}