import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Ticketing · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Soluciones"
      title="Ticketing flexible para cualquier evento."
      subtitle="Define tantos tipos de entrada como necesites — general, VIP, early bird, nominativas, guestlist — con precios, límites por usuario y ventanas de venta independientes. Sin restricciones por plan."
      bullets={[
        { title: "Tipos ilimitados", body: "Crea las variantes que quieras: VIP, palco, bono, guestlist. Cada una con su lógica." },
        { title: "Precios dinámicos", body: "Programa subidas por fecha — early bird, segunda fase, taquilla — con un calendario." },
        { title: "Límite por usuario", body: "Evita reventa: limita cuántas entradas puede comprar un mismo email." },
        { title: "Cupones de descuento", body: "% o cantidad fija, con max usos y vigencia. Ámbito por evento o por toda la org." },
        { title: "Nominativas", body: "Captura nombre/DNI del asistente en checkout. Imprescindible para mayores de 18 y eventos privados." },
        { title: "Reembolsos", body: "Cancela un ticket con un clic. El reembolso se sincroniza con tu contabilidad Noa." },
      ]}
      sections={[
        {
          title: "Pensado para vender de verdad",
          body: "El flujo de checkout está optimizado para mobile. Aceptamos tarjeta (Stripe), Bizum y TPV bancario español (Redsys). Tus compradores no abandonan en pagina de pago.",
        },
        {
          title: "QR antifalsificable",
          body: "Cada entrada lleva una firma HMAC criptográfica. Un QR sin firma o con firma alterada es rechazado al instante por el validador. Imposible duplicar.",
        },
      ]}
    />
  );
}
