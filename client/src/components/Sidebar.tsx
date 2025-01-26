import { Link } from "wouter";
import { Home, PawPrint, Heart, Users } from "lucide-react";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function Sidebar() {
  return (
    <UISidebar>
      <SidebarHeader className="pb-0">
        <div className="flex h-16 items-center px-4">
          <div className="w-8 h-8 bg-[#FF5C7F] rounded-full flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Mascotas">
              <Link href="/mascotas" className="flex items-center gap-2">
                <PawPrint className="h-4 w-4" />
                <span>Mascotas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Adopciones">
              <Link href="/adopciones" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Adopciones</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Usuarios">
              <Link href="/usuarios" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Usuarios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </UISidebar>
  );
}