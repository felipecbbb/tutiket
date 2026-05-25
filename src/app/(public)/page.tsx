import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listPublicUpcomingEvents } from "@/server/actions/events";
import { getCurrentUser } from "@/server/auth";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { EventCard } from "@/components/events/event-card";
import { Hero } from "./_components/hero";

export const dynamic = "force-dynamic"; // hasta tener BD configurada

export default async function HomePage() {
  const [events, user] = await Promise.all([
    listPublicUpcomingEvents(12),
    getCurrentUser(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-liquid absolute -top-1/3 -left-1/4 size-[80vw] rounded-full bg-primary/30 blur-3xl" />
        <div className="bg-liquid absolute top-1/4 -right-1/4 size-[60vw] rounded-full bg-secondary/25 blur-3xl [animation-delay:-7s]" />
        <div className="bg-liquid absolute -bottom-1/3 left-1/4 size-[70vw] rounded-full bg-accent/20 blur-3xl [animation-delay:-14s]" />
      </div>

      <div className="border-b border-border bg-background/50 backdrop-blur">
        <div className="flex overflow-hidden whitespace-nowrap py-2 text-xs font-mono uppercase tracking-widest">
          <div className="animate-marquee flex shrink-0 gap-8 pr-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-8">
                <span>★ early bird disponible</span>
                <span>· entradas con QR firmado ·</span>
                <span>★ pago bizum + tarjeta + redsys</span>
                <span>· organiza tu evento gratis ·</span>
                <span>★ validación instantánea ·</span>
                <span>· promotores con comisiones ·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteHeader />
      <Hero isAuthenticated={Boolean(user)} />

      <section id="proximos" className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                · Próximos ·
              </p>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Encuentra tu próxima noche
              </h2>
            </div>
            <Link
              href="/eventos"
              className="hidden items-center gap-1 text-sm font-medium hover:text-primary md:inline-flex"
            >
              Ver todos
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          {events.length === 0 ? (
            <EmptyState isAuthenticated={Boolean(user)} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  slug={evt.slug}
                  name={evt.name}
                  location={evt.location}
                  category={evt.category}
                  startDate={evt.startDate}
                  endDate={evt.endDate}
                  bannerUrl={evt.bannerUrl}
                  thumbnailUrl={evt.thumbnailUrl}
                  capacity={evt.capacity}
                  ticketsSold={evt.ticketsSold}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function EmptyState({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <p className="font-display text-2xl font-bold">Aún no hay eventos publicados</p>
      <p className="max-w-md text-sm text-muted-foreground">
        Pronto verás aquí los próximos planes.
      </p>
      <Link
        href={isAuthenticated ? "/org/nueva" : "/registro"}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {isAuthenticated ? "Crear organización" : "Empezar gratis"}
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}
