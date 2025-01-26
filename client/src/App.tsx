import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ManagePets from "@/pages/manage-pets";
import ManageUsers from "@/pages/manage-users";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHeader } from "@/components/DesktopHeader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mascotas" component={ManagePets} />
      <Route path="/adopciones" component={Dashboard} />
      <Route path="/usuarios" component={ManageUsers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex bg-gray-50">
          {/* Sidebar */}
          <div className="fixed inset-y-0 z-50">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 ml-64">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white">
              <DesktopHeader />
            </div>

            {/* Main content area with scroll */}
            <main className="flex-1 p-8 overflow-auto">
              <div className="max-w-7xl mx-auto">
                <Router />
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;