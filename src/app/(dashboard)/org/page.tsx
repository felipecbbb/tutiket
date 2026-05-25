import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { listMyOrganizations } from "@/server/actions/organizations";
import { Button } from "@/components/ui/button";

export default async function OrgIndexPage() {
  const orgs = await listMyOrganizations();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Organizaciones ·
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tus organizaciones
          </h1>
        </div>
        <Button asChild>
          <Link href="/org/nueva">
            <Plus className="size-4" />
            Nueva organización
          </Link>
        </Button>
      </div>

      {orgs.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <Sparkles className="size-6 text-primary" />
          <p className="font-display text-2xl font-bold">
            Aún no tienes organizaciones
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Crea tu primera organización para empezar a publicar eventos y
            vender entradas. Te llevará 30 segundos.
          </p>
          <Button asChild className="mt-2">
            <Link href="/org/nueva">
              Crear organización
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {orgs.map((org) => (
            <li key={org.id}>
              <Link
                href={`/org/${org.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60"
              >
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {org.sector.replace("_", " ")}
                  </p>
                  <h2 className="font-display text-xl font-bold truncate group-hover:text-primary">
                    {org.name}
                  </h2>
                  {org.location && (
                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                      {org.location}
                    </p>
                  )}
                </div>
                <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
