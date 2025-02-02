import { Switch, Route } from "wouter";
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
import { Loader2 } from "lucide-react";

function ProtectedRoute({ 
  children, 
  allowedRoles = ["USER", "ADMIN"],
  redirectTo = "/auth/login"
}: { 
  children: React.ReactNode;
  allowedRoles?: Array<"USER" | "ADMIN">;
  redirectTo?: string;
}) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = redirectTo;
    return null;
  }

  if (!allowedRoles.includes(user.rolNombre)) {
    window.location.href = user.rolNombre === "ADMIN" ? "/dashboard" : "/user/adopciones";
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
        <main className="pt-16">
          {children}
        </main>
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
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function Router() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth/registro-adoptante" component={RegistroAdoptante} />
      <Route path="/auth/login">
        {() => {
          if (user) {
            window.location.href = user.rolNombre === "ADMIN" ? "/dashboard" : "/user/adopciones";
            return null;
          }
          return <AuthPage />;
        }}
      </Route>
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