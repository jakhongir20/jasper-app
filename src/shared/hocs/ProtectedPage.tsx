import { getCookie } from "@/shared/lib/services";
import { Navigate } from "react-router-dom";

export default function ProtectedPage({ element }: { element: JSX.Element }) {
  const isAuthenticated = () => {
    const token = getCookie("__token") || localStorage.getItem("__token");
    return !!token;
  };

  return isAuthenticated() ? element : element
    // <Navigate to="/auth/login" replace />;
}
