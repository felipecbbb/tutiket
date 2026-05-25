import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Club · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Discoteca y club"
      theme="yellow"
      title="Cada viernes, sin esfuerzo."
      highlight="sin esfuerzo"
      subtitle="Recurrencia semanal automática, equipo de RR.PP. con comisiones, guest list para tu DJ. Las ventas entran y tu contabilidad se actualiza sola."
      bullets={[
        { title: "Eventos recurrentes", body: "Crea la plantilla \"Viernes Tech\" una vez. Se duplica cada semana." },
        { title: "RR.PP. con comisiones", body: "Tu equipo trae gente, cobra su comisión. Lo ves en tiempo real." },
        { title: "Guest list", body: "Listas por DJ, artista o invitado especial. Bulk import desde Excel." },
        { title: "Validación rápida", body: "PWA móvil, escanea en segundos. Sin lectores especiales." },
        { title: "Cupones para fidelizar", body: "Códigos de descuento por cliente recurrente o campaña." },
        { title: "Aforo en vivo", body: "Sabes cuánta gente queda dentro para gestionar puertas." },
      ]}
      visual={<ClubVisual />}
    />
  );
}

function ClubVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#1d1d1f" />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={50 + i * 90}
          cy="60"
          r="18"
          fill={["#FF6B5B", "#FFD60A", "#34C759", "#6D28D9"][i]}
          opacity="0.85"
        />
      ))}
      <path
        d="M 30 180 Q 90 140, 150 180 T 270 180 T 340 180"
        stroke="#FFD60A"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 30 210 Q 90 170, 150 210 T 270 210 T 340 210"
        stroke="#FF6B5B"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <text x="180" y="245" textAnchor="middle" style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2 }} fill="#FFD60A">
        SAT 23h - 06h
      </text>
    </svg>
  );
}
