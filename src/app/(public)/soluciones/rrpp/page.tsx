import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Equipo RR.PP. · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Equipo RR.PP."
      theme="lila"
      title="Vende más con tu gente."
      highlight="con tu gente"
      subtitle="Crea equipos, asigna comisiones por miembro o por evento concreto, comparte links únicos. Cada venta atribuida automáticamente — quien la trajo, cuánto se lleva, cuándo cobra."
      bullets={[
        { title: "Comisiones flexibles", body: "Base por miembro, override por equipo o por evento. La que aplica gana." },
        { title: "Link de afiliado", body: "Cada RR.PP. tiene código único. Si una compra entra con su link, se le atribuye." },
        { title: "Equipos multinivel", body: "Manager → miembros. El manager configura comisiones de su equipo." },
        { title: "Liquidaciones", body: "Reporte automático tras cada evento. Listo para pagar." },
        { title: "Dashboard del PR", body: "Cada miembro ve sus ventas, comisión y eventos asignados." },
        { title: "Invitaciones por email", body: "Compartes un link, el RR.PP. crea cuenta y queda activo." },
      ]}
      sections={[
        {
          title: "Atribución sin discusiones",
          body: "El código del afiliado viaja con el comprador. Si entra por el link de Marina, la venta es de Marina aunque la pague tres días después. Comisiones calculadas en céntimos, sin redondeos.",
        },
      ]}
      visual={<RrppVisual />}
    />
  );
}

function RrppVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#E5D9F2" />
      {/* Equipo */}
      {[
        { x: 60, y: 60, name: "Marina", val: "412 €" },
        { x: 200, y: 60, name: "Lucas", val: "287 €" },
        { x: 130, y: 165, name: "Aitor", val: "198 €" },
      ].map((m) => (
        <g key={m.name} transform={`translate(${m.x}, ${m.y})`}>
          <circle cx="35" cy="20" r="20" fill="#fff" />
          <text x="35" y="26" textAnchor="middle" style={{ fontSize: 14, fontWeight: 800 }} fill="#6D28D9">{m.name[0]}</text>
          <text x="35" y="58" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} fill="#1d1d1f">{m.name}</text>
          <text x="35" y="74" textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }} fill="#6D28D9">{m.val}</text>
        </g>
      ))}
      <text x="180" y="255" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }} fill="#6D28D9">COMISIONES DE LA SEMANA</text>
    </svg>
  );
}
