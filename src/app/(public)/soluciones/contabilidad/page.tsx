import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Contabilidad con Noa · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="El diferencial"
      theme="sand"
      title="Tus eventos hablan con tu contabilidad."
      highlight="hablan"
      subtitle="Cada venta, cada comisión, cada reembolso — se sincroniza automáticamente con tu cuenta de Noa. IVA categorizado, facturas a clientes, cuotas trimestrales calculadas. Cero Excel."
      bullets={[
        { title: "Conexión 1-clic", body: "Vinculas tu Noa una vez. Desde entonces, todo fluye solo." },
        { title: "Categorización automática", body: "Ingresos por evento, comisiones PR como gasto, devoluciones — todo etiquetado." },
        { title: "IVA repercutido y soportado", body: "Calculamos qué corresponde a Hacienda. Listo para tu modelo 303." },
        { title: "Facturas automáticas", body: "Si tu comprador es empresa y pide factura, se emite con tus datos fiscales." },
        { title: "Modelo 130 / 200", body: "Noa estima tu pago fraccionado según ventas reales. Sin sustos." },
        { title: "Dashboard único", body: "Ves tus eventos y tus finanzas en un solo lugar." },
      ]}
      sections={[
        {
          title: "Cómo funciona",
          body: "Cuando se confirma una venta en Noa Events, se crea automáticamente un movimiento en tu Noa con el desglose: bruto, comisión Noa Events, IVA repercutido, comisión PR si la hay, neto. Si reembolsas, se genera el movimiento inverso.",
        },
        {
          title: "¿Y si aún no tengo Noa?",
          body: "Puedes seguir vendiendo sin conectar Noa. Tu panel ya te muestra ingresos, top eventos y ocupación. Cuando te apetezca dar el salto a contabilidad automática, lo conectas en 30 segundos.",
        },
      ]}
      visual={<AccountingVisual />}
    />
  );
}

function AccountingVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#FCE4B6" />
      {[
        { y: 40, label: "Venta General", val: "+15,00", color: "#1B7E5E" },
        { y: 95, label: "Comisión Noa Events (2%)", val: "−0,30", color: "#FF6B5B" },
        { y: 150, label: "IVA repercutido (21%)", val: "−3,15", color: "#6D28D9" },
      ].map((r) => (
        <g key={r.label} transform={`translate(40, ${r.y})`}>
          <rect width="280" height="42" rx="10" fill="#fff" />
          <text x="20" y="26" style={{ fontSize: 12, fontWeight: 600 }} fill="#1d1d1f">{r.label}</text>
          <text x="260" y="26" textAnchor="end" style={{ fontSize: 14, fontWeight: 800 }} fill={r.color}>{r.val} €</text>
        </g>
      ))}
      <line x1="40" x2="320" y1="210" y2="210" stroke="#1d1d1f" strokeDasharray="4 4" />
      <text x="40" y="232" style={{ fontSize: 12, fontWeight: 700 }} fill="#1d1d1f">Neto en Noa</text>
      <text x="320" y="232" textAnchor="end" style={{ fontSize: 16, fontWeight: 800 }} fill="#1B7E5E">11,55 €</text>
      <text x="180" y="262" textAnchor="middle" style={{ fontSize: 10, letterSpacing: 2 }} fill="#8B6F12">SINCRONIZADO HACE 2s</text>
    </svg>
  );
}
