import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <article className="flex-1 mx-auto max-w-3xl px-6 py-12 lg:px-12">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">· Legal ·</p>
        <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight">Cookies</h1>

        <h2 className="mt-10 font-sans text-xl font-bold">Qué usamos</h2>
        <p className="mt-2 text-muted-foreground">
          Solo cookies técnicas necesarias para mantenerte logueado y para el
          carrito de compra. No usamos cookies de publicidad ni de
          seguimiento de terceros sin tu consentimiento.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Cookies de sesión</h2>
        <p className="mt-2 text-muted-foreground">
          <code>better-auth.session_token</code> — guarda tu sesión iniciada.
          Expira a los 30 días o cuando cierras sesión.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Cookies de terceros</h2>
        <p className="mt-2 text-muted-foreground">
          Stripe / Redsys pueden añadir sus propias cookies durante el flujo
          de pago. Son necesarias para procesar la transacción de forma
          segura.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
