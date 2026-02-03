import axios from "axios";
import { toast } from "sonner";
import type { BodyError } from "./models/BodyError";

export function toastHttpError(err: unknown, fallback = "Ocurrió un error") {
  if (axios.isAxiosError<BodyError>(err)) {
    const body = err.response?.data;

    if (body?.fieldErrors?.length) {
      toast.error(body.message ?? fallback, {
        description: body.fieldErrors
          .map((f) => `• ${f.field}: ${f.message}`)
          .join("\n"),
      });
      return;
    }

    toast.error(body?.message ?? fallback);
    return;
  }

  toast.error(fallback);
}
