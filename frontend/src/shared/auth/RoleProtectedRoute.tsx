import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

type Props = { allowedRoles: string[] };

const RoleProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
    const { loading, role } = useAuth();

    if (loading) return <div>Cargando...</div>;

    if (!role) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

    return <Outlet />;
}

export default RoleProtectedRoute;