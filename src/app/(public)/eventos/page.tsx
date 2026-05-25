import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Drama, GlassWater, Mic2, Music2, Sparkles, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = {
  title: "Tipos de evento",
  description:
    "Noa Events funciona para festivales, conciertos, eventos deportivos, conferencias, club, teatro y privados.",
};

const TYPES = [
  { href: "/sectores/festivales", icon: Music2, name: "Festivales", color: "#FFD7C7", accent: "#FF6B5B" },
  { href: "/sectores/club", icon: GlassWater, name: "Discoteca · Club", color: "#FFE9A8", accent: "#B58900" },
  { href: "/sectores/conciertos", icon: Mic2, name: "Conciertos", color: "#D8F3DC", accent: "#1B7E5E" },
  { href: "/sectores/deportes", icon: Trophy, name: "Eventos deportivos", color: "#CFE2FF", accent: "#1B5EBA" },
  { href: "/sectores/conferencias", icon: Building2, name: "Conferencias", color: "#E5D9F2", accent: "#6D28D9" },
  { href: "/sectores/teatro", icon: Drama, name: "Teatro y artes", color: "#FFD7E1", accent: "#C2185B" },
  { href: "/sectores/privados", icon: Sparkles, name: "Bodas y privados", color: "#FCE4B6", accent: "#8B6F12" },
];

export default function EventTypesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute -top-20 -right-20 size-[400px] rounded-full bg-gradient-to-br from-[#FFD7C7] to-[#FFE9A8] blur-3xl opacity-60" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Tipos de evento ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-[-0.02em] md:text-7xl leading-[1.02]">
            Funciona para todo.
            <br />
            <span className="text-muted-foreground">Literalmente.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground md:text-lg">
            Una maratón de 5.000 corredores, un concierto numerado, un boda
            privada, una conferencia de 3 días, un festival con cinco escenarios.
            La misma plataforma — adaptada a cada sector.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-6xl grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.name}
                href={t.href}
                className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-card p-7 transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl"
              >
                <div
                  className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${t.color} 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="inline-flex size-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: t.color }}
                >
                  <Icon className="size-6" style={{ color: t.accent }} />
                </div>
                <h2 className="mt-5 font-sans text-xl font-bold tracking-tight">
                  {t.name}
                </h2>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  Ver detalle
                  <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-foreground text-background p-10 text-center">
          <p className="font-sans text-2xl font-bold md:text-3xl">
            ¿Tu evento no encaja en ninguna categoría?
          </p>
          <p className="mt-3 text-background/70">
            Sale igual. Crea tu evento y configúralo a tu manera.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90"
            >
              Crear evento
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/nosotros/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-background/20 px-6 py-3 text-sm font-medium hover:bg-background/10"
            >
              Hablar con ventas
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
