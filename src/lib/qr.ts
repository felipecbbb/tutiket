import crypto from "node:crypto";
import { env } from "@/lib/env";

const QR_SECRET = env.BETTER_AUTH_SECRET; // reusamos el secret de la app

/**
 * Firma el id de un ticket. El QR contiene `${ticketId}.${signature}`.
 * Cualquier modificación invalida la firma (HMAC).
 */
export function signTicketQR(ticketId: string): string {
  const sig = crypto
    .createHmac("sha256", QR_SECRET)
    .update(ticketId)
    .digest("base64url");
  return `${ticketId}.${sig}`;
}

/**
 * Devuelve el ticketId si la firma es válida, null en caso contrario.
 * Usa comparación constante para evitar timing attacks.
 */
export function verifyTicketQR(qr: string): string | null {
  const parts = qr.trim().split(".");
  if (parts.length !== 2) return null;
  const [ticketId, sig] = parts;
  if (!ticketId || !sig) return null;
  const expected = crypto
    .createHmac("sha256", QR_SECRET)
    .update(ticketId)
    .digest("base64url");
  // Comparación constante
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  try {
    return crypto.timingSafeEqual(a, b) ? ticketId : null;
  } catch {
    return null;
  }
}
