import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Cargando...</div>;

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
};

export default ProtectedRoute;