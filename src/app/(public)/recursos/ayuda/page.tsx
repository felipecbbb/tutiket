import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { FaqSection } from "./faq-section";

export const metadata: Metadata = { title: "Centro de ayuda" };

const FAQS = [
  {
    q: "¿Cuánto cuesta usar Noa Events?",
    a: "Crear cuenta y configurar eventos es gratis. Cobramos una comisión del 2% sobre cada entrada vendida. No hay coste de set-up, ni mensualidad, ni penalización si no vendes.",
  },
  {
    q: "¿Cuándo recibo el dinero de las entradas?",
    a: "Si usas Stripe, el dinero llega a tu cuenta bancaria en 2-3 días laborables. Si usas Redsys (TPV bancario español), depende de tu acuerdo con el banco — normalmente al día siguiente.",
  },
  {
    q: "¿Cómo funciona la aprobación de una organización?",
    a: "Cuando creas tu organización, queda en estado pendiente. El equipo de Noa Events la revisa (suele tardar horas, no días). Una vez aprobada, tus eventos activos aparecen en la web pública.",
  },
  {
    q: "¿Puedo cancelar un evento y devolver el dinero?",
    a: "Sí. Desde el panel del evento puedes cancelarlo. Si vendiste entradas, puedes reembolsar a todos los compradores en un clic. El reembolso se sincroniza con tu contabilidad Noa.",
  },
  {
    q: "¿Es seguro el QR? ¿Se puede falsificar?",
    a: "Cada QR lleva una firma HMAC criptográfica con un secret que solo conoce el servidor. Un QR sin firma o con firma alterada se rechaza al instante. Imposible falsificar sin acceso al secret.",
  },
  {
    q: "¿Qué pasos tengo que dar para vender mi primer ticket?",
    a: "1) Te registras con email. 2) Creas tu organización (datos básicos). 3) Esperas aprobación (suele tardar horas). 4) Creas tu primer evento como borrador. 5) Añades tipos de entrada (general, VIP…). 6) Publicas el evento. Listo, ya puedes vender.",
  },
  {
    q: "¿Cómo se integra con Noa (contabilidad)?",
    a: "Si tienes cuenta en Noa (heynoa.es), la conectas una vez desde Ajustes. A partir de ese momento, cada venta, comisión y reembolso se sincroniza automáticamente con tu contabilidad. Categorización automática, IVA calculado, facturas si aplica.",
  },
  {
    q: "¿Mis compradores pagan en Bizum?",
    a: "Sí, vía Redsys o Stripe (según la pasarela configurada). También aceptamos tarjeta, Apple Pay y Google Pay.",
  },
  {
    q: "¿Puedo invitar gente a mi equipo (validadores, RR.PP., co-organizadores)?",
    a: "Sí. Desde tu org, sección Equipo, los invitas por email con rol concreto. Reciben un enlace, se registran (o entran si ya tenían cuenta) y quedan asociados a tu org con los permisos de ese rol.",
  },
  {
    q: "¿Está disponible mi sector? Tengo un evento atípico.",
    a: "Funciona para cualquier evento con entradas: festivales, conciertos, deporte, conferencias, teatro, eventos privados. Si no estás seguro, escríbenos a soporte y te decimos.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Centro de ayuda ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-6xl">
            Preguntas frecuentes
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Todo lo que sueles preguntarnos antes de empezar. Si no encuentras
            la respuesta, escríbenos a soporte y te respondemos en menos de 24h.
          </p>
        </div>
      </section>

      <FaqSection faqs={FAQS} />

      <SiteFooter />
    </main>
  );
}
