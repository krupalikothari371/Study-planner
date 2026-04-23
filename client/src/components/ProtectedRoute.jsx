import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <Loader text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
