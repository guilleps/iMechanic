import { AlertTriangle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { verifyAccount } from "../api/auth.api";
import TermsAndPolicies from "@/shared/components/TermsAndPolicies";

function VerifyEmail() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = useMemo(
    () => new URLSearchParams(search).get("token") ?? "",
    [search],
  );

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token inválido o no proporcionado.");
        return;
      }

      setStatus("loading");
      try {
        const { data } = await verifyAccount(token);
        if (data.success) {
          setMessage("Correo verificado correctamente.");
          setStatus("success");
        } else {
          setMessage("Error al verificar el correo.");
          setStatus("error");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Ocurrió un error";
        setMessage(msg);
        setStatus("error");
      }
    };
    run();
  }, [token]);

  const handleGoToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-(--muted) flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
            <Mail className="w-6 h-6 text-[hsl(var(--primary-foreground))]" />
          </div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Verificación de correo
          </h1>
        </div>

        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg border shadow-lg">
          <div className="flex flex-col space-y-1.5 p-6 text-center">
            {status === "loading" && (
              <div className="flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verificando tu correo...</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-[hsl(var(--status-ready))]" />
                <div className="font-semibold leading-none tracking-tight text-xl">
                  ¡Correo verificado!
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {message}
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3">
                <AlertTriangle className="w-10 h-10 text-[hsl(var(--destructive))]" />
                <div className="font-semibold leading-none tracking-tight text-xl">
                  No se pudo verificar
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] text-balance text-center">
                  {message ||
                    "El enlace puede haber expirado o ser inválido. Solicita uno nuevo."}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 pt-0 space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
            {status === "success" && (
              <div className="flex gap-3">
                <button
                  onClick={handleGoToLogin}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[hsl(var(--background))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))] h-10 px-4 py-2 flex-1"
                >
                  Iniciar sesión
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="flex gap-3">
                <Link
                  to="/check-email"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 flex-1 text-center"
                >
                  Reenviar enlace
                </Link>
                <button
                  onClick={handleGoToLogin}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[hsl(var(--background))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 h-10 px-4 py-2 w-full"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        <TermsAndPolicies />
      </div>
    </div>
  );
}

export default VerifyEmail;
