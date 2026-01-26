import { loginWorkshop, logout, refreshSession } from "@/auth/api/auth.api";
import { useEffect, useMemo, useState } from "react";
import { AuthContext, type Role } from "./useAuth";


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!role;
    useEffect(() => {
        (async () => {
            try {
                const data = await refreshSession();
                setRole(data.role as Role);
            } catch {
                setRole(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginWorkshop({ email, password });
        setRole(data.role as Role);
    };

    const signout = async () => {
        await logout();
        setRole(null);
    };

    const value = useMemo(
        () => ({ isAuthenticated, role, loading, login, signout }),
        [isAuthenticated, role, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};