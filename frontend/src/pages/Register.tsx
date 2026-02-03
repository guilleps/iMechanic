import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench,
  Building2,
  User,
  Mail,
  Lock,
  Hash,
  Eye,
  EyeOff,
  Map,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerWorkshop } from "@/api/auth.api";
import { toast } from "sonner";
import { toastHttpError } from "@/lib/httpErrorToast";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    workshopName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const validPassword = () => {
    const regex: RegExp =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z0-9])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(formData.password);
  };

  const confirmationPassword = () => {
    return formData.password === formData.confirmPassword;
  };

  const validPhone = () => {
    return /^9\d{8}$/.test(formData.phone);
  };

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
      toast.success("Taller registrado", { description: workshop.message });
      navigate(`/check-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: unknown) {
      toastHttpError(err, "No se pudo registrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Wrench className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">iMechanic</h1>
            <p className="text-sm text-muted-foreground">Gestión de Taller</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Registrar Taller</CardTitle>
            <CardDescription>
              Información del taller & Datos del administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workshopName">Nombre del Taller</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="workshopName"
                    type="text"
                    placeholder="AutoServicio Express"
                    className="pl-10"
                    value={formData.workshopName}
                    onChange={(e) =>
                      setFormData({ ...formData, workshopName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Nombre del Propietario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="ownerName"
                    type="text"
                    placeholder="Ej. Martin Cabrera"
                    className="pl-10"
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@taller.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.password.length > 0 && !validPassword() && (
                  <p className="text-[14px] text-red-500">
                    Debe tener al menos 8 caracteres, una mayúscula, un símbolo.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {formData.confirmPassword.length > 0 &&
                  !confirmationPassword() && (
                    <p className="text-[14px] text-red-500">
                      Las contraseñas no coinciden.
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">
                  Dirección
                  <span className="ml-1 text-[hsl(var(--muted-foreground))] font-normal text-xs">
                    (Opcional)
                  </span>
                </Label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Av. Brasil 999"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Número de teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="999 999 999"
                    className="pl-10"
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
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Crear cuenta"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Al registrarte, aceptas nuestros{" "}
          <Link to="/terminos" className="underline">
            términos de servicio
          </Link>{" "}
          y{" "}
          <Link to="/privacidad" className="underline">
            política de privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
