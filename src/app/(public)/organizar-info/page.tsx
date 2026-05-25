import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Megaphone, Receipt, ScanLine, Ticket, Users } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { getCurrentUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Organiza tu evento",
  description: "Vende entradas, gestiona equipo y lleva tu contabilidad solo. Empieza gratis.",
};

export default async function OrganizarInfoPage() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/organizar" : "/registro?next=/organizar";

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Para organizadores ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-7xl leading-[1.05]">
            Vende tickets como un pro.
            <br />
            <span className="text-muted-foreground">Cobra como uno.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground md:text-lg">
            Noa Events junta ticketing y contabilidad en una sola plataforma.
            Configura tu primer evento en 5 minutos. Tu equipo valida en la
            puerta. Tu contabilidad se actualiza sola en Noa.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-base font-medium text-background hover:opacity-90"
            >
              Empezar ahora
              <ArrowUpRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              icon={<Ticket />}
              title="Tantos tipos como necesites"
              body="General, VIP, early bird, guestlist, nominativa. Cada una con stock, precio, límite por usuario y ventana de venta propias."
            />
            <Card
              icon={<Megaphone />}
              title="RR.PP. con comisiones"
              body="Crea equipos, asigna comisiones por miembro o evento. Cada venta atribuida automáticamente."
            />
            <Card
              icon={<ScanLine />}
              title="Validación móvil"
              body="Tu equipo escanea con el móvil. QR firmado HMAC — imposible falsificar. Validación en tiempo real."
            />
            <Card
              icon={<Users />}
              title="Listas de invitados"
              body="Importa en bulk, exporta CSV, gestiona prepagados. Cada invitado recibe su QR único."
            />
            <Card
              icon={<BarChart3 />}
              title="Stats en vivo"
              body="Ventas, ingresos, ocupación, top entradas, asistencia. Decisiones con datos reales."
            />
            <Card
              icon={<Receipt />}
              title="Contabilidad con Noa"
              body="Cada euro que entra se categoriza solo en Noa. IVA, autónomos, sociedades — sin Excel."
              highlight
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-sans text-3xl font-bold tracking-tight md:text-4xl text-center">
            Tres pasos
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3 list-none">
            <Step
              n={1}
              title="Crea tu organización"
              body="Datos básicos. El super-admin revisa tu cuenta para activarte en la web pública (suele tardar horas)."
            />
            <Step
              n={2}
              title="Publica tu evento"
              body="Sube cartel, define entradas, asigna RR.PP., invita validadores. Personaliza la página."
            />
            <Step
              n={3}
              title="Cobra y contabiliza"
              body="Recibe en tu cuenta bancaria. Noa actualiza tu contabilidad automáticamente."
            />
          </ol>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-foreground text-background p-10 text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight md:text-4xl">
            Tu primer evento, en menos de lo que tardas en pedir un café.
          </h2>
          <p className="mt-4 text-background/70">
            Sin coste de set-up. Sin contrato. Solo pagas comisión cuando vendes.
          </p>
          <Link
            href={ctaHref}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90"
          >
            Crear cuenta gratis
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Card({
  icon,
  title,
  body,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 transition-all hover:-translate-y-0.5 ${
        highlight
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card hover:border-foreground/40"
      }`}
    >
      <div
        className={`inline-flex size-10 items-center justify-center rounded-xl ${
          highlight ? "bg-background/15" : "bg-muted"
        } [&_svg]:size-5`}
      >
        {icon}
      </div>
      <p className="mt-4 font-sans font-bold tracking-tight">{title}</p>
      <p
        className={`mt-1.5 text-sm ${
          highlight ? "text-background/70" : "text-muted-foreground"
        }`}
      >
        {body}
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="rounded-2xl border border-border bg-card p-6">
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-foreground text-background font-bold">
        {n}
      </span>
      <p className="mt-4 font-sans text-lg font-bold tracking-tight">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </li>
  );
}
