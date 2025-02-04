import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  requiredRole?: string[];
  component: React.ComponentType;
};

export function ProtectedRoute({ path, requiredRole, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth/login" />
      </Route>
    );
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <Route path={path}>
        <Redirect to="/dashboard/panel-de-control" />
      </Route>
    );
  }

  return <Route path={path}>{(params) => <Component {...params} />}</Route>;
}