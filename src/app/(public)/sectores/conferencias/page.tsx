import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Conferencias · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Conferencias"
      theme="lila"
      title="Conferencias profesionales."
      highlight="profesionales"
      subtitle="Pases multi-día, badges nominativos con datos del asistente, tracks paralelos por sala. Para summits tecnológicos, congresos, eventos corporativos."
      bullets={[
        { title: "Badges con QR", body: "PDF imprimible con nombre, empresa y QR personalizado." },
        { title: "Tracks por sala", body: "Asignas tickets a sala A o B. Validación filtra por track." },
        { title: "Patrocinadores tier", body: "Gold, Silver, Bronze. Logos según tier en la página." },
        { title: "Facturación a empresa", body: "El comprador indica datos de empresa, se genera factura con IVA." },
        { title: "Networking opcional", body: "Lista de asistentes (opt-in) accesible desde el evento." },
      ]}
      visual={<ConferenceVisual />}
    />
  );
}

function ConferenceVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#E5D9F2" />
      {/* Badge */}
      <g transform="translate(80, 50)">
        <rect width="200" height="180" rx="14" fill="#fff" stroke="#6D28D9" strokeWidth="2" />
        <rect x="0" y="0" width="200" height="35" rx="14" fill="#6D28D9" />
        <text x="100" y="22" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }} fill="#fff">
          TECHSUMMIT 2026
        </text>
        <text x="100" y="80" textAnchor="middle" style={{ fontSize: 18, fontWeight: 700 }} fill="#1d1d1f">
          María García
        </text>
        <text x="100" y="98" textAnchor="middle" style={{ fontSize: 11 }} fill="#666">
          CTO · Acme Corp
        </text>
        {/* QR */}
        <g transform="translate(70, 115)">
          {[...Array(5)].map((_, r) =>
            [...Array(5)].map((_, c) => {
              const filled = (r + c) % 2 === 0 || (r === 0 && c === 0);
              return filled ? <rect key={`${r}-${c}`} x={c * 12} y={r * 12} width="11" height="11" fill="#1d1d1f" /> : null;
            }),
          )}
        </g>
      </g>
    </svg>
  );
}
