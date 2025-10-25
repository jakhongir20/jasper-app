import { Navigate } from "react-router-dom";
import { useProfile } from "@/features/auth/login/model/auth.queries";
import { AppLoading } from "@/shared/ui";

export default function AdminProtectedPage({
  element,
}: {
  element: JSX.Element;
}) {
  const { data: user, isLoading, error } = useProfile();

  // Show loading while fetching user data
  if (isLoading) {
    return <AppLoading />;
  }

  // If there's an error or no user data, redirect to login
  if (error || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user is admin
  if (!user.is_admin) {
    // Redirect non-admin users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is admin, allow access
  return element;
}
