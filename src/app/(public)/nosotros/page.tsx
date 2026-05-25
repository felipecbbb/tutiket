import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = { title: "Sobre nosotros" };

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Sobre Noa Events ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-7xl leading-[1.05]">
            Un equipo pequeño construyendo algo grande.
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-muted-foreground">
            Noa Events nace dentro de Noa, la plataforma de asistencia personal
            con IA para autónomos y pequeñas empresas. Vimos que los
            organizadores de eventos perdían horas reconciliando ventas con
            contabilidad y pagaban comisiones absurdas a las ticketeras. Así
            que construimos la nuestra.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-3">
          <Pillar
            n="01"
            title="Honesto con el precio"
            body="2% fijo. Sin mensualidades, sin set-up, sin penalizaciones por no vender."
          />
          <Pillar
            n="02"
            title="Conectado con tu negocio"
            body="Tu ticketing habla con tu contabilidad. Cero Excel. Cero doble entrada."
          />
          <Pillar
            n="03"
            title="Para todos los eventos"
            body="Una discoteca, una conferencia, un torneo de pádel. Funciona igual de bien."
          />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-10">
          <h2 className="font-sans text-3xl font-bold tracking-tight md:text-4xl">
            ¿De dónde venimos?
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Empezamos con Noa — un asistente personal de IA que organiza tus
            finanzas, facturación y productividad en un solo sitio. Al hablar
            con clientes nos repetían el mismo problema: vender entradas era
            caro y desconectado del resto de su negocio. Noa Events es la
            respuesta — la primera ticketera pensada para que tus números
            cuadren solos.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Estamos en Canarias 🇮🇨. Nos gustan los productos bien hechos y las
            cosas dichas claras.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/nosotros/equipo"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Conoce al equipo
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/nosotros/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Contacto
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {n}
      </p>
      <h3 className="mt-2 font-sans text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
