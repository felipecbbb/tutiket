import { z } from "zod";
import { uuidSchema } from "./common";

export const addGuestsSchema = z.object({
  eventId: uuidSchema,
  rows: z
    .array(
      z.object({
        name: z.string().min(2, "Mínimo 2 caracteres").max(120),
        email: z.string().email("Email no válido").optional().or(z.literal("")),
        prepaid: z.boolean().default(false),
      }),
    )
    .min(1, "Añade al menos un invitado")
    .max(500, "Máximo 500 por lote"),
});
export type AddGuestsInput = z.infer<typeof addGuestsSchema>;

/**
 * Parsea texto pegado (CSV / TSV / líneas) con columnas:
 *   nombre, email?, prepaid?
 * Separador detectado: tab, coma o punto-y-coma.
 */
export function parseBulkGuestText(text: string): { name: string; email: string; prepaid: boolean }[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[\t,;]/).map((p) => p.trim());
      const [name, email = "", prepaidRaw = ""] = parts;
      const prepaid = /^(1|true|si|sí|yes)$/i.test(prepaidRaw);
      return { name, email, prepaid };
    })
    .filter((r) => r.name.length > 0);
}
