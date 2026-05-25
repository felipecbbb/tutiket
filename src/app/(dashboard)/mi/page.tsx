import Link from "next/link";
import { ArrowUpRight, Megaphone, Ticket } from "lucide-react";
import { requireSession } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SearchParams = Promise<{ error?: string }>;

export default async function MyAccountPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireSession();
  const { error } = await searchParams;
  const role = (session.user as { role?: string }).role ?? "user";

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Mi cuenta ·
      </p>
      <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight md:text-5xl">
        Hola, {session.user.name.split(" ")[0] ?? session.user.name}
      </h1>

      {error === "forbidden" && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          No tienes permisos para acceder a esa sección.
        </div>
      )}

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-xl">Mis entradas</CardTitle>
          <CardDescription>
            Tus tickets aparecerán aquí cuando hagas tu primera compra.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <Ticket className="size-5 shrink-0" />
            <span>
              Aún no tienes entradas. Descubre próximos eventos en la{" "}
              <Link href="/eventos" className="text-foreground hover:underline">
                página de eventos
              </Link>
              .
            </span>
          </div>
        </CardContent>
      </Card>

      {role === "user" ? (
        <Card className="mt-6 border-foreground/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Megaphone className="size-5" />
              ¿Organizas eventos?
            </CardTitle>
            <CardDescription>
              Convierte tu cuenta en cuenta de promotor. Vas a poder crear
              organización, eventos, entradas, equipo de RR.PP. y mucho más.
              Tu cuenta pasa por una breve verificación del super-admin antes
              de que tus eventos aparezcan en la web pública.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/organizar">
                Empezar onboarding
                <ArrowUpRight className="size-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4">
          <Link
            href="/org"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Mis organizaciones
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-sans text-2xl font-bold mb-1">Tus datos</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Sólo tú ves esta información.
        </p>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <Row label="Nombre" value={session.user.name} />
          <Row label="Email" value={session.user.email} />
          <Row label="Rol" value={role} />
          <Row
            label="Miembro desde"
            value={new Date(session.user.createdAt).toLocaleDateString("es-ES")}
          />
        </dl>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
