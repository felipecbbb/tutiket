import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { Calendar, Clock, MapPin, Users, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { events, organizations, venues, ticketTypes } from "@/db/schema";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function loadEventPage(slug: string) {
  const [evt] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);
  if (!evt || evt.deletedAt || !evt.isPublic) return null;
  // Solo eventos activos (no drafts/cancelados) son visibles públicamente
  if (evt.status !== "active") return null;

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, evt.organizationId))
    .limit(1);

  const venue = evt.venueId
    ? (
        await db.select().from(venues).where(eq(venues.id, evt.venueId)).limit(1)
      )[0] ?? null
    : null;

  const tts = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.eventId, evt.id));

  return { event: evt, organization: org ?? null, venue, ticketTypes: tts };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadEventPage(slug);
  if (!data) return { title: "Evento no encontrado" };
  const { event } = data;
  return {
    title: event.name,
    description: event.description?.slice(0, 160) ?? `${event.name} en ${event.location}`,
    openGraph: {
      title: event.name,
      description: event.description ?? undefined,
      images: event.bannerUrl ? [{ url: event.bannerUrl }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await loadEventPage(slug);
  if (!data) notFound();
  const { event, organization, venue, ticketTypes: tts } = data;

  // Incremento de impresiones (fire-and-forget — no bloquear render)
  void db
    .update(events)
    .set({ impressions: sql`${events.impressions} + 1` })
    .where(eq(events.id, event.id));

  const ratio =
    event.capacity > 0
      ? Math.min(100, Math.round((event.ticketsSold / event.capacity) * 100))
      : 0;
  const soldOut = event.capacity > 0 && event.ticketsSold >= event.capacity;
  const cancelled = event.status === "cancelled";
  const isLive = event.status === "active" && !soldOut && !cancelled;

  const minPrice = tts.length > 0 ? Math.min(...tts.map((t) => t.priceCents)) : null;

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero con banner */}
      <section className="relative">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted md:aspect-[21/7]">
          {event.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.bannerUrl}
              alt={event.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
      </section>

      <section className="px-6 lg:px-12 -mt-24 relative">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium uppercase tracking-widest text-background">
              {event.category}
            </span>
            {cancelled && (
              <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase text-destructive-foreground">
                Cancelado
              </span>
            )}
            {soldOut && !cancelled && (
              <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase text-destructive-foreground">
                Agotado
              </span>
            )}
            {event.minimumAge && (
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
                +{event.minimumAge}
              </span>
            )}
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            {event.name}
          </h1>

          {organization && (
            <p className="mt-4 text-sm text-muted-foreground">
              Organiza{" "}
              <span className="font-semibold text-foreground">
                {organization.name}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <InfoTile
                icon={<Calendar className="size-4" />}
                label="Cuándo"
                value={formatDate(event.startDate, {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                })}
              />
              <InfoTile
                icon={<Clock className="size-4" />}
                label="Apertura"
                value={event.doorOpeningTime ?? "—"}
              />
              <InfoTile
                icon={<MapPin className="size-4" />}
                label="Dónde"
                value={venue?.name ?? event.location}
              />
              <InfoTile
                icon={<Users className="size-4" />}
                label="Aforo"
                value={event.capacity.toLocaleString("es-ES")}
              />
            </div>

            {event.description && (
              <div>
                <h2 className="font-display text-2xl font-bold mb-3">El evento</h2>
                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {event.dresscode && (
              <DetailBlock title="Dresscode" content={event.dresscode} />
            )}
            {event.additionalInfo && (
              <DetailBlock title="Info adicional" content={event.additionalInfo} />
            )}

            <Separator />

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-accent" />
              <span>
                Entradas con QR firmado HMAC · pago seguro Stripe + Redsys ·
                cancelación según condiciones del organizador
              </span>
            </div>
          </div>

          {/* Sidebar tickets */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Entradas
                </span>
                {minPrice !== null && (
                  <span className="font-display text-lg font-bold">
                    desde {formatPrice(minPrice)}
                  </span>
                )}
              </div>

              {tts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Las entradas todavía no están disponibles.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {tts.map((tt) => {
                    const remaining = Math.max(0, tt.maxQuantity - tt.soldQuantity);
                    const isAvail = remaining > 0;
                    return (
                      <li
                        key={tt.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5"
                      >
                        <div>
                          <div className="text-sm font-medium">{tt.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {isAvail
                              ? `${remaining} disponibles`
                              : "Agotado"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-base font-bold">
                            {formatPrice(tt.priceCents)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${ratio}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {event.ticketsSold.toLocaleString("es-ES")} de{" "}
                {event.capacity.toLocaleString("es-ES")} vendidas
              </p>

              <Button
                className="mt-5 w-full"
                size="lg"
                disabled={!isLive}
                aria-disabled={!isLive}
              >
                {cancelled
                  ? "Evento cancelado"
                  : soldOut
                    ? "Sin entradas"
                    : isLive
                      ? "Comprar entrada"
                      : "Venta no disponible"}
              </Button>
              {isLive && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Checkout disponible próximamente (Fase 2)
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-medium">{value}</div>
    </div>
  );
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{content}</p>
    </div>
  );
}
