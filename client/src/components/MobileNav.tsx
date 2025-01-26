import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileNav() {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <div className="md:hidden">
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="p-0 w-64"
          aria-labelledby="navigation-title"
          aria-describedby="navigation-description"
        >
          <SheetHeader className="px-4 pt-4">
            <SheetTitle id="navigation-title">Menú de Navegación</SheetTitle>
            <SheetDescription id="navigation-description">
              Navegue por las diferentes secciones de la aplicación de adopción de mascotas
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}