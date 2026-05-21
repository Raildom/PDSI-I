import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/controllers/useAuthController";

export function ProtectedRoute({ requireAdmin = false, requireSuper = false }: { requireAdmin?: boolean; requireSuper?: boolean }) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando…
      </div>
    );
  }
  if (!session) return <Navigate to={requireAdmin || requireSuper ? "/admin/login" : "/login"} replace />;
  if (requireSuper && role !== "super_admin") return <Navigate to="/admin" replace />;
  if (requireAdmin && !(role === "admin" || role === "super_admin")) return <Navigate to="/cliente" replace />;
  return <Outlet />;
}
