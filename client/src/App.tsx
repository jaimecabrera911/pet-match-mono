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
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHeader } from "@/components/DesktopHeader";
import Home from "@/pages/Home";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="fixed left-0 top-0 h-full w-64">
        <Sidebar />
      </aside>
      <div className="flex-1 pl-64">
        <header className="fixed top-0 right-0 left-64 bg-white z-10">
          <DesktopHeader />
        </header>
        <main className="pt-16">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={() => (
        <DashboardLayout>
          <Switch>
            <Route path="/mascotas" component={ManagePets} />
            <Route path="/adopciones" component={ManageAdoptions} />
            <Route path="/usuarios" component={ManageUsers} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </DashboardLayout>
      )} />
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