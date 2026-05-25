import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { listMyEvents } from "@/server/actions/dashboard";
import { listMyOrganizations } from "@/server/actions/organizations";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  active: "bg-accent/30 text-accent-foreground",
  draft: "bg-muted text-muted-foreground",
  pending: "bg-primary/20 text-primary",
  inactive: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

export default async function MyEventsPage() {
  const [events, orgs] = await Promise.all([
    listMyEvents(),
    listMyOrganizations(),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Eventos ·
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Mis eventos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {events.length} eventos en {orgs.length}{" "}
            {orgs.length === 1 ? "organización" : "organizaciones"}
          </p>
        </div>
        {orgs.length > 0 && (
          <Button asChild>
            <Link href={`/org/${orgs[0].slug}/eventos/nuevo`}>
              <Plus className="size-4" />
              Nuevo evento
            </Link>
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <Calendar className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 font-display text-2xl font-bold">Aún sin eventos</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {orgs.length === 0
              ? "Crea tu primera organización para empezar."
              : "Crea tu primer evento."}
          </p>
          <Button asChild className="mt-4">
            <Link href={orgs.length === 0 ? "/org/nueva" : `/org/${orgs[0].slug}/eventos/nuevo`}>
              {orgs.length === 0 ? "Crear organización" : "Crear evento"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Evento</th>
                <th className="px-4 py-3 text-left font-medium">Organización</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Vendidas</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/org/${e.orgSlug}/eventos/${e.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.orgName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(e.startDate, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {e.ticketsSold}/{e.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_BADGE[e.status]}`}
                    >
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
