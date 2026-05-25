import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = { title: "Privacidad" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <article className="flex-1 mx-auto max-w-3xl px-6 py-12 lg:px-12">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">· Legal ·</p>
        <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight">Privacidad</h1>

        <h2 className="mt-10 font-sans text-xl font-bold">Datos que tratamos</h2>
        <p className="mt-2 text-muted-foreground">
          Cuando creas una cuenta guardamos nombre, email, contraseña hasheada
          y los datos de tus entradas. Si eres organizador, también CIF/NIF y
          datos fiscales necesarios para la facturación.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Finalidad</h2>
        <p className="mt-2 text-muted-foreground">
          Gestionar tu cuenta, procesar la compra de entradas, enviar
          confirmaciones por email y, si lo autorizas, sincronizar tu actividad
          con tu cuenta de Noa para contabilidad automática.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Tus derechos</h2>
        <p className="mt-2 text-muted-foreground">
          Acceso, rectificación, supresión, oposición y portabilidad. Escribe
          a soporte@noaevents.app para ejercerlos.
        </p>

        <h2 className="mt-8 font-sans text-xl font-bold">Encargados de tratamiento</h2>
        <p className="mt-2 text-muted-foreground">
          Vercel (hosting), Neon (base de datos en UE), Stripe y Redsys (pago),
          Resend (email), Cloudflare R2 (archivos). Todos cumplen RGPD.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
