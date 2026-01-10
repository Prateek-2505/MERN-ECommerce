import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin allowed
  return children;
};

export default AdminRoute;
