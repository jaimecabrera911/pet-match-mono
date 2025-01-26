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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mascotas" component={ManagePets} />
      <Route path="/adopciones" component={ManageAdoptions} />
      <Route path="/usuarios" component={ManageUsers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Sidebar - fixed */}
          <div className="fixed inset-y-0 z-50">
            <Sidebar />
          </div>

          {/* Main content wrapper - scrollable */}
          <div className="flex-1 ml-64 flex flex-col h-screen">
            {/* Header - fixed */}
            <div className="sticky top-0 z-40 bg-white">
              <DesktopHeader />
            </div>

            {/* Main content - scrollable */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto p-8">
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