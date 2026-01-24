import TermsAndPolicies from "@/shared/components/TermsAndPolicies";
import { Mail } from "lucide-react";
import { useLocation } from "react-router-dom";

function VerifyEmailNotice() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const email = params.get("email") ?? "";

  return (
    <div className="min-h-screen bg-(--muted) flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
            <Mail className="w-6 h-6 text-[hsl(var(--primary-foreground))]" />
          </div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Confirmar cuenta
          </h1>
        </div>

        <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg border shadow-lg">
          <div className="flex flex-col space-y-1.5 p-6 text-center">
            <div className="font-semibold leading-none tracking-tight text-xl">
              Revisa tu correo
            </div>
          </div>

          <div className="flex flex-col text-center">
            <p className="m-10 text-sm text-[hsl(var(--muted-foreground))]">
              Te enviamos un enlace de verificación a{" "}
              <span className="font-medium text-[hsl(var(--foreground))] text-xl">
                {email}
              </span>
            </p>
          </div>

          {/* Body */}
          <div className="p-6 pt-0 space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
            <p className="text-center">
              Si no lo ves, revisa <b>Spam</b> o <b>Promociones</b>.
            </p>

            <div className="flex gap-3">
              <a
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 flex-1"
                href="https://mail.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                Abrir Gmail
              </a>

              <a
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] h-10 px-4 py-2 flex-1"
                href="https://outlook.live.com/mail/"
                target="_blank"
                rel="noreferrer"
              >
                Abrir Outlook
              </a>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[hsl(var(--background))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))] h-10 px-4 py-2 flex-1"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>

        <TermsAndPolicies />
      </div>
    </div>
  );
}

export default VerifyEmailNotice;
