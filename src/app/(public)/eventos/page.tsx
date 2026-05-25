import type { Metadata } from "next";
import Link from "next/link";
import { listPublicUpcomingEvents } from "@/server/actions/events";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { EventCard } from "@/components/events/event-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Todos los próximos eventos disponibles",
};

export default async function EventsListPage() {
  const events = await listPublicUpcomingEvents(60);

  return (
    <main className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="px-6 py-12 lg:px-12 lg:py-16 flex-1">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Próximos eventos ·
          </p>
          <h1 className="mt-2 font-display text-5xl font-bold tracking-tight md:text-6xl">
            Todos los eventos
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            {events.length === 0
              ? "Aún no hay eventos publicados — vuelve pronto."
              : `${events.length} ${events.length === 1 ? "evento" : "eventos"} disponibles ahora mismo.`}
          </p>

          {events.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  slug={evt.slug}
                  name={evt.name}
                  location={evt.location}
                  category={evt.category}
                  startDate={evt.startDate}
                  bannerUrl={evt.bannerUrl}
                  thumbnailUrl={evt.thumbnailUrl}
                  capacity={evt.capacity}
                  ticketsSold={evt.ticketsSold}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <Link
                href="/registro"
                className="font-display text-2xl font-bold hover:text-primary"
              >
                ¿Eres organizador? Publica el primero →
              </Link>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
