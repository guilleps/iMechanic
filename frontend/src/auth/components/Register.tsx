import { Building2, Eye, EyeOff, Lock, Mail, Map, Phone, User, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerWorkshop } from "../api/auth.api";
import { toastHttpError } from "@/shared/lib/httpErrorToast";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    workshopName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });

  const validPassword = () => {
    const regex: RegExp = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z0-9])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(formData.password);
  };

  const confirmationPassword = () => {
    return formData.password === formData.confirmPassword;
  };

  const validPhone = () => {
    return /^9\d{8}$/.test(formData.phone);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validPassword() || !confirmationPassword()) {
      alert("Revisa tu contraseña");
      return;
    }

    if (!validPhone()) {
      alert("Número de teléfono inválido");
      return;
    }

    setIsLoading(true);

    try {
      const workshop = await registerWorkshop(formData);
      toast.success("Taller registrado", { description: workshop.message }); navigate("/");
    } catch (err: unknown) {
      toastHttpError(err, "No se pudo registrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--muted) flex items-center justify-center p-4">
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
            <div className="font-semibold leading-none tracking-tight text-xl">Registrar Taller</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Información del taller & administrador
            </div>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-left text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nombre del Taller</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="workshopName"
                    type="text"
                    placeholder="AutoServicio Express"
                    className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                    value={formData.workshopName}
                    onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nombre del Administrador</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="ownerName"
                    type="text"
                    placeholder="Juan García"
                    className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Correo electrónico</label>
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
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
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
                {formData.password.length > 0 && !validPassword() && (
                  <p className="text-[14px] text-red-500">
                    Debe tener al menos 8 caracteres, una mayúscula,
                    un símbolo.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                {formData.confirmPassword.length > 0 && !confirmationPassword() && (
                  <p className="text-[14px] text-red-500">
                    Las contraseñas no coinciden.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Dirección
                  <span className="ml-1 text-[hsl(var(--muted-foreground))] font-normal text-xs">(Opcional)</span>
                </label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="address"
                    type="text"
                    placeholder="Av. Brasil 999"
                    className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Número de teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="999 999 999"
                    className="flex h-10 w-full rounded-md border border-input bg-[hsl(var(--background))] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phone: value });
                    }}
                    required
                  />
                </div>
                {formData.phone.length > 0 && !validPhone() && (
                  <p className="text-[14px] text-red-500">
                    El número debe iniciar con 9 y tener 9 dígitos.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[hsl(var(--background))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))] h-10 px-4 py-2 flex-1" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Crear cuenta'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
          Al registrarte, aceptas nuestros <Link to="/terminos" className="underline">términos de servicio</Link> y <Link to="/privacidad" className="underline">política de privacidad</Link>.
        </p>
      </div>
    </div>
  )
}

export default Register
