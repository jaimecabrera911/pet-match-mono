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
        <div className="flex h-screen bg-gray-50">
          {/* Fixed sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 z-30">
            <Sidebar />
          </div>

          {/* Main content area */}
          <div className="flex-1 ml-64">
            {/* Fixed header */}
            <div className="fixed top-0 right-0 left-64 z-20">
              <DesktopHeader />
            </div>

            {/* Scrollable content */}
            <div className="h-full pt-16 overflow-y-auto">
              <Router />
            </div>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;