import Link from "next/link";
import { requireRole } from "@/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        <Link
          href="/admin"
          className="rounded-full bg-card border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Resumen
        </Link>
        <Link
          href="/admin/usuarios"
          className="rounded-full bg-card border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Usuarios
        </Link>
        <Link
          href="/admin/organizaciones"
          className="rounded-full bg-card border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Organizaciones
        </Link>
        <Link
          href="/admin/eventos"
          className="rounded-full bg-card border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Eventos
        </Link>
        <Link
          href="/admin/venues"
          className="rounded-full bg-card border border-border px-3.5 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Locales
        </Link>
      </div>
      {children}
    </div>
  );
}
