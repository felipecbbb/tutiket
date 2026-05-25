import Link from "next/link";
import { ArrowRight, BarChart3, Megaphone, Receipt, ScanLine, Ticket, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { requireSession } from "@/server/auth";
import { NewOrgButton } from "../org/_components/new-org-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PromoterOnboardingPage() {
  const session = await requireSession();
  const role = (session.user as { role?: string }).role;

  // Si ya tiene rol superior, va directo al panel
  if (role && role !== "user") {
    redirect("/org");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Conviértete en promotor ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Crea tu organización y empieza a vender entradas
      </h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">
        Rellena los datos básicos de tu organización. El super-admin la
        revisará en breve y, una vez aprobada, podrás publicar eventos que
        aparecerán en la web pública.
      </p>

      <div className="mt-8">
        <NewOrgButton />
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Lo que vas a poder hacer</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Feature
          icon={<Ticket className="size-5" />}
          title="Crear eventos y entradas"
          description="Define varios tipos de entrada (general, VIP, early bird, guestlist), precios, límites y ventanas de venta."
        />
        <Feature
          icon={<Megaphone className="size-5" />}
          title="Equipo de RR.PP."
          description="Invita miembros, configura comisiones por afiliado y compártele links únicos para vender."
        />
        <Feature
          icon={<ScanLine className="size-5" />}
          title="Validador en la puerta"
          description="Tu equipo escanea entradas con QR firmados (HMAC). Imposibles de falsificar."
        />
        <Feature
          icon={<Users className="size-5" />}
          title="Listas de invitados"
          description="Bulk import desde CSV, exportación, gestión de prepagados y free guests."
        />
        <Feature
          icon={<BarChart3 className="size-5" />}
          title="Estadísticas en vivo"
          description="Ventas por evento, top entradas, ocupación, ingresos."
        />
        <Feature
          icon={<Receipt className="size-5" />}
          title="Datos fiscales y cupones"
          description="Tu información legal y descuentos para campañas o embajadores."
        />
      </div>

      <Card className="mt-12 border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">Cómo funciona la aprobación</CardTitle>
          <CardDescription>
            1. Creas tu organización con los datos básicos.<br />
            2. El super-admin recibe una notificación y revisa la solicitud.<br />
            3. Cuando se aprueba, tus eventos activos aparecen automáticamente
            en la web pública.<br />
            4. Mientras tanto puedes seguir configurando entradas, equipo, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/admin"
            className="hidden text-sm text-muted-foreground"
          >
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-primary [&_svg]:size-5">{icon}</div>
      <p className="mt-2 font-display text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
