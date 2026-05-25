import { requireRole } from "@/server/auth";

export default async function ValidatePage() {
  await requireRole(["validator", "organizer", "admin"]);
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Validador de entradas ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
        Validar QR
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Scanner móvil pendiente (Fase 3).
      </p>
    </div>
  );
}
