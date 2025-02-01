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
import CuestionarioAdopcion from "@/pages/cuestionario-adopcion";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHeader } from "@/components/DesktopHeader";
import { MobileNav } from "@/components/MobileNav";
import Home from "@/pages/Home";
import AuthPage from "./pages/auth-page";

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
        {() => <Dashboard />}
      </Route>
      <Route path="/dashboard/mascotas">
        {() => <ManagePets />}
      </Route>
      <Route path="/dashboard/adopciones">
        {() => <ManageAdoptions />}
      </Route>
      <Route path="/dashboard/usuarios">
        {() => <ManageUsers />}
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
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <SidebarProvider defaultOpen={true}>
        <Router />
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;