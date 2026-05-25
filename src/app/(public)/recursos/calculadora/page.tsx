import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { CommissionCalculator } from "../../_components/calculator";

export const metadata: Metadata = { title: "Calculadora de comisiones" };

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Recursos ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-6xl">
            Estima cuánto te llevas neto.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
            Sin sorpresas. Nuestra comisión es del 2% sobre cada entrada
            vendida — punto. No cobramos mensualidades ni set-up.
          </p>
        </div>
      </section>
      <CommissionCalculator />
      <SiteFooter />
    </main>
  );
}
