import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { listMyVenues } from "@/server/actions/dashboard";
import { listMyOrganizations } from "@/server/actions/organizations";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MyVenuesPage() {
  const [venues, orgs] = await Promise.all([
    listMyVenues(),
    listMyOrganizations(),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Locales ·
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Mis locales
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {venues.length} en total
          </p>
        </div>
        {orgs.length > 0 && (
          <Button asChild>
            <Link href={`/org/${orgs[0].slug}/locales/nuevo`}>
              <Plus className="size-4" />
              Nuevo local
            </Link>
          </Button>
        )}
      </div>

      {venues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <MapPin className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 font-display text-2xl font-bold">Aún sin locales</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Añade el sitio donde celebras tus eventos.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <li key={v.id} className="rounded-xl border border-border bg-card p-5">
              <p className="font-display text-lg font-bold">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.orgName}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {v.location}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Aforo: {v.capacity.toLocaleString("es-ES")} ·{" "}
                <span
                  className={
                    v.status === "active" ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {v.status}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
