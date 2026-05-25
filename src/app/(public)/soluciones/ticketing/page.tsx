import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Ticketing · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Ticketing"
      theme="coral"
      title="Vende como un equipo de 10."
      highlight="equipo de 10"
      subtitle="Define tantos tipos de entrada como necesites — general, VIP, early bird, nominativas, guestlist — con precios, límites por usuario y ventanas de venta independientes. Sin restricciones por plan."
      bullets={[
        { title: "Tipos ilimitados", body: "VIP, palco, bono, guestlist. Cada uno con su lógica de venta." },
        { title: "Precios dinámicos", body: "Programa subidas por fecha: early bird, segunda fase, taquilla." },
        { title: "Límite por usuario", body: "Evita reventa: máximo de entradas por email." },
        { title: "Cupones de descuento", body: "% o cantidad fija, max usos y vigencia. Por evento o por toda la org." },
        { title: "Nominativas", body: "Captura nombre y DNI en checkout. Para +18 o eventos privados." },
        { title: "Reembolsos", body: "Cancela con un clic. Se sincroniza con tu contabilidad." },
      ]}
      sections={[
        {
          title: "Pensado para vender de verdad",
          body: "Checkout optimizado para móvil. Tarjeta (Stripe), Bizum y TPV bancario español (Redsys). Sin abandono en la página de pago.",
        },
        {
          title: "QR antifalsificable",
          body: "Cada entrada lleva una firma HMAC criptográfica. Un QR sin firma o con firma alterada se rechaza al instante. Imposible duplicar.",
        },
      ]}
      visual={<TicketingVisual />}
    />
  );
}

function TicketingVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#FFD7C7" />
      {[
        { y: 50, name: "General", price: "15€", filled: false },
        { y: 110, name: "VIP", price: "45€", filled: true },
        { y: 170, name: "Early bird", price: "10€", filled: false },
      ].map((t) => (
        <g key={t.name} transform={`translate(50, ${t.y})`}>
          <rect width="260" height="50" rx="14" fill={t.filled ? "#1d1d1f" : "#fff"} stroke="#1d1d1f" strokeWidth="1.5" />
          <text x="20" y="32" style={{ fontSize: 14, fontWeight: 700 }} fill={t.filled ? "#fff" : "#1d1d1f"}>{t.name}</text>
          <text x="240" y="32" textAnchor="end" style={{ fontSize: 16, fontWeight: 800 }} fill={t.filled ? "#FF6B5B" : "#1d1d1f"}>{t.price}</text>
        </g>
      ))}
      <text x="180" y="248" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }} fill="#1d1d1f">3 TIPOS · MISMO EVENTO</text>
    </svg>
  );
}
