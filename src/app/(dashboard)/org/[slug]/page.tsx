import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgePercent, BarChart3, Calendar, MapPin, Megaphone, Pencil, Receipt, Ticket, Users } from "lucide-react";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listEventsByOrg } from "@/server/actions/events";
import { listVenuesByOrg } from "@/server/actions/venues";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewEventButton } from "./_components/new-event-button";
import { NewVenueButton } from "./_components/new-venue-button";

type Params = Promise<{ slug: string }>;

export default async function OrgDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [events, venues] = await Promise.all([
    listEventsByOrg(org.id),
    listVenuesByOrg(org.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · {org.sector.replace("_", " ")} ·
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          {org.name}
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${
            org.status === "verified"
              ? "bg-accent/30 text-accent-foreground"
              : org.status === "rejected"
                ? "bg-destructive/20 text-destructive"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {org.status}
        </span>
      </div>
      {org.location && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {org.location}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="default" size="sm">
          <Link href={`/org/${slug}/editar`}>
            <Pencil className="size-4" />
            Editar
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/org/${slug}/stats`}>
            <BarChart3 className="size-4" />
            Estadísticas
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/org/${slug}/equipo`}>
            <Users className="size-4" />
            Equipo
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/org/${slug}/cupones`}>
            <BadgePercent className="size-4" />
            Cupones
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/org/${slug}/rrpp`}>
            <Megaphone className="size-4" />
            RR.PP.
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/org/${slug}/datos-fiscales`}>
            <Receipt className="size-4" />
            Datos fiscales
          </Link>
        </Button>
      </div>

      {/* Eventos */}
      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Eventos</h2>
          <NewEventButton
            organizationId={org.id}
            venues={venues.map((v) => ({ id: v.id, name: v.name }))}
          />
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={<Ticket className="size-5" />}
            title="Aún sin eventos"
            description="Crea tu primer evento para empezar a vender entradas."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {events.map((evt) => (
              <li key={evt.id}>
                <Link
                  href={`/org/${slug}/eventos/${evt.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/60"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${statusBadge(evt.status)}`}
                      >
                        {evt.status}
                      </span>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(evt.startDate, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 font-display text-lg font-bold truncate group-hover:text-primary">
                      {evt.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {evt.ticketsSold}/{evt.capacity} vendidas
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Locales */}
      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Locales</h2>
          <NewVenueButton organizationId={org.id} />
        </div>

        {venues.length === 0 ? (
          <EmptyState
            icon={<MapPin className="size-5" />}
            title="Aún sin locales"
            description="Añade el sitio donde se celebran tus eventos."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-3">
            {venues.map((v) => (
              <li
                key={v.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="font-display text-lg font-bold">{v.name}</p>
                <p className="text-xs text-muted-foreground">{v.location}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aforo: {v.capacity.toLocaleString("es-ES")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-accent/30 text-accent-foreground";
    case "draft":
      return "bg-muted text-muted-foreground";
    case "pending":
      return "bg-primary/20 text-primary";
    case "cancelled":
      return "bg-destructive/20 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-5 text-sm">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
