import { toastHttpError } from "@/shared/lib/httpErrorToast";
import { Eye, EyeOff, Lock, Mail, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginWorkshop } from "../api/auth.api";

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        const savedLogin = localStorage.getItem('data-login');
        if (savedLogin) {
            const parsedLogin = JSON.parse(savedLogin);
            setFormData((prev) => ({
                ...prev,
                email: parsedLogin.email || "",
                password: "",
            }));
            setIsChecked(true);
        }
    }, []);

    const navigateTo = (role: string) => {
        const redirectByRole: Record<string, string> = {
            ROLE_WORKSHOP_ADMIN: "/dashboard-workshop",
            ROLE_EMPLOYEE: "/dashboard-employee",
            ROLE_CUSTOMER: "/",
        };
        return redirectByRole[role] ?? "/";
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await loginWorkshop(formData);
            toast.success(response.message);

            if (isChecked) {
                localStorage.setItem("data-login", JSON.stringify({ email: formData.email }));
            } else {
                localStorage.removeItem("data-login");
            }

            navigate(navigateTo(response.role), { replace: true });
        } catch (err: unknown) {
            toastHttpError(err, "Credenciales inválidas");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-[hsl(var(--primary-foreground))]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">iMechanic</h1>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Gestión de Taller</p>
                    </div>
                </div>

                <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg border shadow-lg">
                    <div className="flex flex-col space-y-1.5 p-6 text-center">
                        <div className="font-semibold leading-none tracking-tight text-xl">
                            Iniciar Sesión
                        </div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">
                            Ingresa tus credenciales para acceder al sistema
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="admin@taller.com"
                                        className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-border"
                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)}
                                    />
                                    <span className="text-[hsl(var(--muted-foreground))]">Recordarme</span>
                                </label>
                                {/* <Link to="/recuperar" className="text-[hsl(var(--primary))] hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link> */}
                            </div>

                            <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[hsl(var(--background))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 h-10 px-4 py-2 w-full" disabled={isLoading}>
                                {isLoading ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-[hsl(var(--muted-foreground))]">¿No tienes cuenta? </span>
                            <Link to="/register" className="text-[hsl(var(--primary))] hover:underline font-medium">
                                Registra tu taller
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
                    © 2024 iMechanic. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}

export default Login;