import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = { title: "Contacto" };

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Contacto ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-6xl">
            Hablamos.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Si tienes un evento concreto en mente, una integración, una duda
            sobre la API o quieres traer un cliente — escríbenos. Respondemos
            en menos de 24 horas laborables.
          </p>
        </div>
      </section>

      <section className="px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-3xl grid gap-4 sm:grid-cols-2">
          <Card
            icon={<Mail className="size-5" />}
            title="Email"
            value="hola@noaevents.app"
            href="mailto:hola@noaevents.app"
          />
          <Card
            icon={<MessageCircle className="size-5" />}
            title="Soporte"
            value="soporte@noaevents.app"
            href="mailto:soporte@noaevents.app"
          />
          <Card
            icon={<MapPin className="size-5" />}
            title="Ubicación"
            value="Las Palmas de Gran Canaria"
          />
          <Card
            icon={<Mail className="size-5" />}
            title="Prensa"
            value="prensa@noaevents.app"
            href="mailto:prensa@noaevents.app"
          />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center">
          <p className="font-sans text-lg font-bold tracking-tight">
            ¿Eres organizador? Pruébalo tú mismo.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Crear cuenta es gratis. Configurar el primer evento toma 5
            minutos. Si te atascas, escríbenos.
          </p>
          <a
            href="/registro"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            Crear cuenta
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Card({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-border bg-card p-5 h-full transition-all hover:border-foreground/40">
      <div className="inline-flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
        {icon}
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : <div>{inner}</div>;
}
