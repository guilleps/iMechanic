import { Link } from "react-router-dom";

function TermsAndPolicies() {
  return (
    <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-6">
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
  );
}

export default TermsAndPolicies;
