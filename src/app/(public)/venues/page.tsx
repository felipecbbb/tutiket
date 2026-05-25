import type { Metadata } from "next";
import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import { MapPin, Users } from "lucide-react";
import { db } from "@/lib/db";
import { organizations, venues } from "@/db/schema";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locales",
  description: "Descubre los locales y espacios de Noa Events.",
};

async function listPublicVenues() {
  try {
    return await db
      .select({
        id: venues.id,
        slug: venues.slug,
        name: venues.name,
        location: venues.location,
        imageUrl: venues.imageUrl,
        thumbnailUrl: venues.thumbnailUrl,
        capacity: venues.capacity,
        description: venues.description,
      })
      .from(venues)
      .innerJoin(organizations, eq(organizations.id, venues.organizationId))
      .where(
        and(
          eq(venues.isPublic, true),
          eq(venues.status, "active"),
          eq(organizations.status, "verified"),
          isNull(venues.deletedAt),
          isNull(organizations.deletedAt),
        ),
      )
      .limit(60);
  } catch {
    return [];
  }
}

export default async function VenuesPage() {
  const venues = await listPublicVenues();

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="px-6 py-12 lg:px-12 lg:py-16 flex-1">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Espacios ·
          </p>
          <h1 className="mt-2 font-sans text-5xl font-bold tracking-tight md:text-6xl">
            Locales
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            {venues.length === 0
              ? "Aún no hay locales públicos. Vuelve pronto."
              : `${venues.length} ${venues.length === 1 ? "espacio" : "espacios"} donde disfrutar de eventos.`}
          </p>

          {venues.length > 0 && (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((v) => {
                const cover = v.imageUrl ?? v.thumbnailUrl;
                return (
                  <li key={v.id}>
                    <Link
                      href={`/venues/${v.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-foreground/40"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover}
                            alt={v.name}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="size-full bg-gradient-to-br from-muted to-muted/60" />
                        )}
                      </div>
                      <div className="p-5">
                        <p className="font-sans text-lg font-bold tracking-tight">
                          {v.name}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {v.location}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="size-3" />
                          Aforo {v.capacity.toLocaleString("es-ES")}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
