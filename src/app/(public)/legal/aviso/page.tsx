import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = { title: "Aviso legal" };

export default function LegalNoticePage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <article className="prose-noa flex-1 mx-auto max-w-3xl px-6 py-12 lg:px-12">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">· Legal ·</p>
        <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight">Aviso legal</h1>

        <h2 className="mt-10 font-sans text-xl font-bold">Titular</h2>
        <p className="mt-2 text-muted-foreground">
          Noa Events es un servicio operado por la entidad responsable de Noa
          (heynoa.es). Para consultas legales y datos fiscales completos
          contacta con soporte.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Objeto</h2>
        <p className="mt-2 text-muted-foreground">
          Noa Events es una plataforma de venta de entradas para eventos de
          terceros, integrada con servicios de gestión financiera de Noa. La
          relación contractual respecto al evento siempre es entre el
          comprador y el organizador del evento.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Propiedad intelectual</h2>
        <p className="mt-2 text-muted-foreground">
          Los contenidos, diseños, código fuente y marcas de Noa Events son
          propiedad de su titular. Los carteles, imágenes y descripciones de
          cada evento son propiedad del organizador correspondiente.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Limitación de responsabilidad</h2>
        <p className="mt-2 text-muted-foreground">
          Noa Events no se hace responsable de la realización efectiva del
          evento contratado. Cualquier cancelación, cambio de fecha o
          modificación es responsabilidad del organizador.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
