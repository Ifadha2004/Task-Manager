// client/src/router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  const loc = useLocation();

  console.log("[ProtectedRoute]", { ready, user });

  if (!ready) {
    return <div style={{ color: "#aaa", padding: 24 }}>Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <Outlet />;
}
