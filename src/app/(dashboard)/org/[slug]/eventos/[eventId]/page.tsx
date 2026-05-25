import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { db } from "@/lib/db";
import { events } from "@/db/schema";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listTicketTypesByEvent } from "@/server/actions/ticket-types";
import { listEventGuests } from "@/server/actions/guests";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { EventStatusButtons } from "./status-buttons";

type Params = Promise<{ slug: string; eventId: string }>;

const STATUS_BADGE: Record<string, string> = {
  active: "bg-accent/30 text-accent-foreground",
  draft: "bg-muted text-muted-foreground",
  pending: "bg-primary/20 text-primary",
  inactive: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/20 text-destructive",
};

export default async function ManageEventPage({ params }: { params: Params }) {
  const { slug, eventId } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [evt] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!evt || evt.organizationId !== org.id || evt.deletedAt) notFound();

  const [tts, guests] = await Promise.all([
    listTicketTypesByEvent(eventId),
    listEventGuests(eventId).catch(() => []),
  ]);

  const isPublic = evt.status === "active" && evt.isPublic;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/org/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {org.name}
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Evento ·
          </p>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {evt.name}
          </h1>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium uppercase ${STATUS_BADGE[evt.status]}`}
        >
          {evt.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {formatDate(evt.startDate, {
            weekday: "long",
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="inline-flex items-center gap-1.5 truncate">
          <MapPin className="size-3.5" />
          {evt.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5" />
          {evt.ticketsSold}/{evt.capacity} vendidas
        </span>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <EventStatusButtons
          eventId={evt.id}
          currentStatus={evt.status}
          eventSlug={evt.slug}
        />
        {isPublic && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/eventos/${evt.slug}`} target="_blank">
              <ExternalLink className="size-4" />
              Ver público
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/org/${slug}/eventos/${eventId}/invitados`}>
            <Users className="size-4" />
            Invitados
          </Link>
        </Button>
      </div>

      {/* Ticket types */}
      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Entradas</h2>
        </div>
        {tts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Ticket className="size-4" />
              Aún sin tipos de entrada. Sin esto no se puede publicar el evento.
            </p>
            <p className="mt-2 text-xs">
              [Form para crear ticket types llegará en la siguiente iteración.]
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {tts.map((tt) => (
              <li
                key={tt.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-lg font-bold">{tt.name}</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {formatPrice(tt.priceCents)}
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {tt.kind}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {tt.soldQuantity}/{tt.maxQuantity} vendidas · máx {tt.userLimit} por usuario
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Invitados</h2>
          <Button asChild size="sm" variant="outline">
            <Link href={`/org/${slug}/eventos/${eventId}/invitados`}>
              Gestionar
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {guests.length} en la lista
        </p>
      </section>
    </div>
  );
}
