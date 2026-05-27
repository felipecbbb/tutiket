import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/server/auth";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { Hero } from "./_components/hero";
import { StatsCounter } from "./_components/stats-counter";
import { WhatIsNoa } from "./_components/what-is-noa";
import { HowItHelps } from "./_components/how-it-helps";
import { SectorsGrid } from "./_components/sectors-grid";
import { CommissionCalculator } from "./_components/calculator";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="relative min-h-screen flex flex-col bg-background overflow-x-clip">
      <SiteHeader />
      <Hero isAuthenticated={Boolean(user)} />
      <StatsCounter />
      <WhatIsNoa />
      <HowItHelps />
      <SectorsGrid />
      <CommissionCalculator />

      <section className="relative px-6 py-24 lg:px-12 lg:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-to-br from-[#FFD7C7] to-[#E5D9F2] blur-3xl opacity-50" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-5xl font-bold tracking-[-0.02em] md:text-7xl leading-[1.02]">
            ¿Listo para tu primer evento?
          </h2>
          <p className="mt-5 text-muted-foreground md:text-lg">
            Cinco minutos. Sin contrato. Cobras la primera entrada antes de
            terminarte el café.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href={user ? "/org" : "/registro"}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-base font-medium text-background hover:opacity-90"
            >
              {user ? "Ir a mi panel" : "Crear evento gratis"}
              <ArrowUpRight className="size-5" />
            </Link>
            <Link
              href="/nosotros/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/80 backdrop-blur px-7 py-3.5 text-base font-medium hover:bg-muted"
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
