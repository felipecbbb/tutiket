import { slugify } from "@/lib/utils";

/**
 * Genera un slug único usando un callback `exists` para comprobar cada
 * candidato. Si el base ya existe, prueba `${base}-2`, `${base}-3`, …
 *
 * Lo intencionalmente sencillo (sin reflexión de Drizzle) para evitar
 * pelearnos con los tipos genéricos de drizzle-orm. Cada action provee
 * su propia query de existencia.
 */
export async function uniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const seed = slugify(base);
  if (!seed) throw new Error("No se pudo generar slug — entrada vacía");
  if (!(await exists(seed))) return seed;
  for (let i = 2; i < 9999; i++) {
    const candidate = `${seed}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error("No se pudo generar slug único");
}
