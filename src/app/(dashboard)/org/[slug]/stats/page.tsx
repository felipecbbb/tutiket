import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CalendarCheck, Percent, TrendingUp } from "lucide-react";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { getOrgStats } from "@/server/actions/events";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function OrgStatsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const { agg, top, upcoming } = await getOrgStats(org.id);
  const occupancy = agg.capacity > 0 ? Math.round((agg.sold / agg.capacity) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Stats de {org.name} ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Resumen
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<CalendarCheck />}
          label="Eventos totales"
          value={agg.totalEvents.toString()}
        />
        <StatTile
          icon={<Calendar />}
          label="Eventos activos"
          value={agg.activeEvents.toString()}
        />
        <StatTile
          icon={<TrendingUp />}
          label="Entradas vendidas"
          value={agg.sold.toLocaleString("es-ES")}
        />
        <StatTile
          icon={<Percent />}
          label="Ocupación media"
          value={`${occupancy}%`}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold mb-4">Top eventos por ventas</h2>
          {top.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos todavía.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {top.map((evt) => {
                const ratio =
                  evt.capacity > 0
                    ? Math.min(100, Math.round((evt.ticketsSold / evt.capacity) * 100))
                    : 0;
                return (
                  <li key={evt.id}>
                    <Link
                      href={`/eventos/${evt.slug}`}
                      className="block group"
                      target="_blank"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium truncate group-hover:text-primary">
                          {evt.name}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {evt.ticketsSold}/{evt.capacity}
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold mb-4">Próximos eventos</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes eventos programados.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {upcoming.map((evt) => (
                <li key={evt.id} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/eventos/${evt.slug}`}
                    target="_blank"
                    className="min-w-0 hover:text-primary"
                  >
                    <p className="font-medium truncate">{evt.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(evt.startDate, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                      evt.status === "active"
                        ? "bg-accent/30 text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {evt.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
