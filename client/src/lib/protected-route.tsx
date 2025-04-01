import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, Redirect } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !user ? (
        <Redirect to="/auth" />
      ) : (
        <AppLayout title={getPageTitle(path)}>
          <Component />
        </AppLayout>
      )}
    </Route>
  );
}

// Helper function to derive page titles from path
function getPageTitle(path: string): string {
  if (path === "/") return "Dashboard";
  
  // Handle nested routes
  const basePath = path.split("/")[1];
  
  // Convert kebab-case to Title Case
  const formattedTitle = basePath
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
    
  return formattedTitle;
}