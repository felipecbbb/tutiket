import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BarChart3, Megaphone, Receipt, ScanLine, Ticket, Users } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { getCurrentUser } from "@/server/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Para organizadores",
  description: "Ticketing + contabilidad automática con Noa. Empieza gratis.",
};

const FEATURES = [
  {
    icon: Ticket,
    title: "Tantos tipos como necesites",
    body: "General, VIP, early bird, guestlist, nominativa. Cada una con stock, precio y ventana de venta independiente.",
    color: "#FFD7C7",
    ink: "#FF6B5B",
  },
  {
    icon: Megaphone,
    title: "RR.PP. con comisiones",
    body: "Crea equipos, asigna comisiones por miembro o por evento. Atribución automática.",
    color: "#D8F3DC",
    ink: "#1B7E5E",
  },
  {
    icon: ScanLine,
    title: "Validación móvil",
    body: "Escaneo desde cualquier smartphone. QR firmado HMAC, imposible falsificar.",
    color: "#FFE9A8",
    ink: "#B58900",
  },
  {
    icon: Users,
    title: "Listas de invitados",
    body: "Bulk import CSV, exportación, prepagados vs free. Cada invitado con su QR.",
    color: "#E5D9F2",
    ink: "#6D28D9",
  },
  {
    icon: BarChart3,
    title: "Stats en vivo",
    body: "Ventas, ingresos, ocupación, top entradas. Datos para decidir.",
    color: "#CFE2FF",
    ink: "#1B5EBA",
  },
  {
    icon: Receipt,
    title: "Contabilidad con Noa",
    body: "Cada euro que entra se categoriza solo en tu Noa. IVA, modelos, facturas — sin Excel.",
    color: "#1d1d1f",
    ink: "#FF6B5B",
    dark: true,
  },
];

export default async function OrganizarInfoPage() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/organizar" : "/registro?next=/organizar";

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute -top-24 -right-24 size-[440px] rounded-full bg-gradient-to-br from-[#FFD7C7] to-[#FFE9A8] blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-[400px] rounded-full bg-gradient-to-br from-[#D8F3DC] to-[#CFE2FF] blur-3xl opacity-50" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD7C7] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#FF6B5B]">
            · Para organizadores ·
          </span>
          <h1 className="mt-5 font-sans text-5xl font-bold tracking-[-0.02em] md:text-7xl leading-[1.02]">
            Vende.{" "}
            <span className="relative inline-block">
              Cobra.
              <svg
                aria-hidden
                viewBox="0 0 160 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 w-full h-3 text-[#FF6B5B]"
              >
                <path
                  d="M2 9 Q 30 1, 60 6 T 120 6 T 158 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{" "}
            Contabiliza.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-muted-foreground md:text-lg">
            Noa Events junta ticketing y contabilidad en una sola plataforma.
            Primer evento en 5 minutos. Tu equipo valida en la puerta. Tu
            contabilidad se actualiza sola en{" "}
            <Link href="/nosotros" className="underline underline-offset-4">
              Noa
            </Link>
            .
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-base font-medium text-background hover:opacity-90"
            >
              Empezar ahora
              <ArrowUpRight className="size-5" />
            </Link>
            <Link
              href="/recursos/calculadora"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/80 backdrop-blur px-7 py-3.5 text-base font-medium hover:bg-muted"
            >
              Calcular ingresos
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const dark = f.dark;
              return (
                <div
                  key={f.title}
                  className={`group rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                    dark
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/10 bg-card hover:border-foreground/30 hover:shadow-lg"
                  }`}
                >
                  <div
                    className="inline-flex size-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: dark ? "rgba(255,255,255,0.1)" : f.color,
                    }}
                  >
                    <Icon
                      className="size-5"
                      style={{ color: dark ? f.ink : f.ink }}
                    />
                  </div>
                  <p className="mt-5 font-sans text-lg font-bold tracking-tight">
                    {f.title}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      dark ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-sans text-4xl font-bold tracking-[-0.02em] md:text-5xl text-center">
            Tres pasos. <span className="text-muted-foreground">Sin más.</span>
          </h2>
          <ol className="mt-14 grid gap-6 md:grid-cols-3 list-none">
            <Step
              n="01"
              title="Crea tu organización"
              body="Datos básicos. Revisamos tu cuenta en horas y activamos los eventos públicos."
              color="#FFD7C7"
              ink="#FF6B5B"
            />
            <Step
              n="02"
              title="Publica tu evento"
              body="Cartel, fechas, entradas, RR.PP., validadores. Personaliza la página."
              color="#D8F3DC"
              ink="#1B7E5E"
            />
            <Step
              n="03"
              title="Cobra y contabiliza"
              body="Recibes en tu banco. Noa actualiza tu contabilidad sin que toques nada."
              color="#E5D9F2"
              ink="#6D28D9"
            />
          </ol>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-foreground p-10 text-background text-center">
          <div className="pointer-events-none absolute -top-24 -right-24 size-[280px] rounded-full bg-[#FF6B5B] blur-3xl opacity-30" />
          <h2 className="font-sans text-3xl font-bold tracking-[-0.01em] md:text-4xl">
            Empieza antes de terminarte el café.
          </h2>
          <p className="mt-4 text-background/70">
            Sin coste inicial. Sin contrato. Solo 2% cuando vendes.
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

function Step({
  n,
  title,
  body,
  color,
  ink,
}: {
  n: string;
  title: string;
  body: string;
  color: string;
  ink: string;
}) {
  return (
    <li className="rounded-3xl border border-foreground/10 bg-card p-7">
      <div
        className="inline-flex size-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: color }}
      >
        <span
          className="font-sans text-lg font-bold tracking-tight"
          style={{ color: ink }}
        >
          {n}
        </span>
      </div>
      <p className="mt-5 font-sans text-xl font-bold tracking-tight">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </li>
  );
}
