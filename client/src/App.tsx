import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { DashboardNav } from "@/components/DashboardNav";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ManagePets from "@/pages/manage-pets";
import ManageUsers from "@/pages/manage-users";
import ManageAdoptions from "@/pages/manage-adoptions";
import { AdoptionForm } from "@/components/AdoptionForm";
import CuestionarioAdopcion from "@/pages/cuestionario-adopcion";
import UserAdoptions from "@/pages/user-adoptions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHeader } from "@/components/DesktopHeader";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import RegistroAdoptante from "@/pages/registro-adoptante";
import AuthPage from "./pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Panel de navegación */}
      <DashboardNav />

      {/* Navegación móvil */}
      <MobileNav />

      {/* Contenido principal */}
      <div className="flex-1 md:pl-64">
        <header className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-white border-b">
          <DesktopHeader />
        </header>
        <main className="pt-16 px-4">
          {children}
        </main>
      </div>
    </div>
  );
}

function DashboardRouter() {
  return (
    <Switch>
      <Route path="/dashboard/panel-de-control" component={Dashboard} />
      <ProtectedRoute 
        path="/dashboard/mascotas"
        requiredRole={["admin", "shelter"]}
        component={ManagePets}
      />
      <ProtectedRoute
        path="/dashboard/adopciones"
        requiredRole={["admin", "shelter"]}
        component={ManageAdoptions}
      />
      <ProtectedRoute
        path="/dashboard/usuarios"
        requiredRole={["admin"]}
        component={ManageUsers}
      />
      <Route path="/dashboard">
        {() => {
          window.location.href = "/dashboard/panel-de-control";
          return null;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth/registro-adoptante" component={RegistroAdoptante} />
      <Route path="/auth/login" component={AuthPage} />
      <Route path="/cuestionario-adopcion" component={CuestionarioAdopcion} />
      <Route path="/dashboard/*">
        {(params) => (
          <DashboardLayout>
            <DashboardRouter />
          </DashboardLayout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider defaultOpen={true}>
          <Router />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;