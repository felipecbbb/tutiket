import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Eventos privados · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Bodas · galas · corporativos"
      theme="sand"
      title="Eventos privados que cuidan los detalles."
      highlight="detalles"
      subtitle="Lista cerrada de invitados — no aparece en la web pública, sólo accesible con link directo. Confirmaciones, menús, acompañantes, todo lo que un evento privado necesita."
      bullets={[
        { title: "Evento no público", body: "No se lista en Noa Events. Solo quien tenga el link puede acceder." },
        { title: "RSVP rápido", body: "Tu invitado confirma asistencia y elige menú en 30 segundos." },
        { title: "Acompañantes", body: "Cada invitado declara cuántos vienen y sus nombres." },
        { title: "Restricciones alimentarias", body: "Veggie, vegano, sin gluten — todo recogido por invitado." },
        { title: "Lista para catering", body: "Export CSV con cabezas, menús y notas para el evento." },
      ]}
      visual={<PrivateVisual />}
    />
  );
}

function PrivateVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#FCE4B6" />
      {/* Sobre invitación */}
      <g transform="translate(60, 70)">
        <rect width="240" height="160" rx="12" fill="#fff" stroke="#8B6F12" strokeWidth="2" />
        <path
          d="M 0 0 L 120 80 L 240 0"
          stroke="#8B6F12"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="120" cy="100" r="30" fill="#FCE4B6" />
        <text x="120" y="106" textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, fontStyle: "italic" }} fill="#8B6F12">
          María & Luis
        </text>
        <text x="120" y="140" textAnchor="middle" style={{ fontSize: 11, letterSpacing: 2 }} fill="#8B6F12">
          12 · SEPT · 2026
        </text>
      </g>
      <text x="180" y="265" textAnchor="middle" style={{ fontSize: 10, letterSpacing: 3 }} fill="#8B6F12">
        SOLO INVITACIÓN
      </text>
    </svg>
  );
}
