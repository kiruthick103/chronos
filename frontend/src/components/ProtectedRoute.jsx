import { useAuth } from "../context/AuthContext";
import AuthLoader from "./AuthLoader";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <AuthLoader />;
  }

  if (!user) {
    // Redirect to login handled by AppContent
    return null;
  }

  if (adminOnly && !isAdmin) {
    // Non-admin trying to access admin route
    return null;
  }

  return children;
}
