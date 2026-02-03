import { createContext, useContext } from "react";

export type Role = "ROLE_WORKSHOP_ADMIN" | "ROLE_EMPLOYEE" | "ROLE_CUSTOMER";

export type AuthState = {
  isAuthenticated: boolean;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Role>;
  signout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
