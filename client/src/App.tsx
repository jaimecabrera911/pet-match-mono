import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ManagePets from "@/pages/manage-pets";
import ManageUsers from "@/pages/manage-users";
import ManageAdoptions from "@/pages/manage-adoptions";
import { AdoptionForm } from "@/components/AdoptionForm";
import CuestionarioAdopcion from "@/pages/cuestionario-adopcion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHeader } from "@/components/DesktopHeader";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import UserAdoptions from "@/pages/user-adoptions";
import RegistroAdoptante from "@/pages/registro-adoptante";
import AuthPage from "./pages/auth-page";
import { AdoptionInterview } from "@/components/AdoptionInterview";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";

function ProtectedRoute({
  children,
  allowedRoles = ["USER", "ADMIN"],
}: {
  children: React.ReactNode;
  allowedRoles?: Array<"USER" | "ADMIN">;
}) {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login");
      return;
    }

    if (!isLoading && user && !allowedRoles.includes(user.rolNombre)) {
      setLocation("/");
      return;
    }
  }, [user, isLoading, allowedRoles, setLocation]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.rolNombre)) {
    return null;
  }

  return <>{children}</>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64">
        <Sidebar />
      </aside>
      <MobileNav />
      <div className="flex-1 md:pl-64">
        <header className="fixed top-0 right-0 left-0 md:left-64 z-10">
          <DesktopHeader />
        </header>
        <main className="pt-16">{children}</main>
      </div>
    </div>
  );
}

function DashboardRouter() {
  return (
    <Switch>
      <Route path="/dashboard/panel-de-control">
        {() => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/mascotas">
        {() => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManagePets />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/adopciones">
        {() => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageAdoptions />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/adopciones/crear">
        {() => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdoptionForm />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/adopciones/entrevista">
        {() => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdoptionInterview />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/usuarios">
        {() => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ManageUsers />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => {
          window.location.href = "/dashboard/panel-de-control";
          return null;
        }}
      </Route>
      <Route>{() => <NotFound />}</Route>
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
      <Route path="/user/adopciones">
        {() => (
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserAdoptions />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/*">
        {(params) => (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout>
              <DashboardRouter />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <Router />
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;