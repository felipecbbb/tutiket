import { requireRole } from "@/server/auth";

export default async function AdminPage() {
  await requireRole(["admin"]);
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Super-admin ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
        Panel admin
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Sección pendiente de implementar (Fase 4).
      </p>
    </div>
  );
}
