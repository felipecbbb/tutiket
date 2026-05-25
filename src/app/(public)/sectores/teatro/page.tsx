import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Teatro · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Teatro y artes"
      theme="rose"
      title="Teatro y artes escénicas."
      highlight="escénicas"
      subtitle="Sesiones diarias, butacas numeradas, abonos de temporada. Pensado para teatros municipales, compañías independientes, salas de música clásica."
      bullets={[
        { title: "Múltiples funciones", body: "Una obra, muchas sesiones. Cada una con su aforo y precio." },
        { title: "Butaca numerada", body: "Mapa interactivo del teatro. El comprador elige asiento." },
        { title: "Abonos de temporada", body: "Vende toda la temporada a precio reducido en un único ticket." },
        { title: "Descuentos jóvenes / mayores", body: "Cupones por colectivo con verificación opcional." },
        { title: "Programa cultural", body: "Página del teatro con calendario completo de funciones." },
      ]}
      visual={<TheaterVisual />}
    />
  );
}

function TheaterVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#FFD7E1" />
      {/* Telón */}
      <rect x="0" y="0" width="360" height="60" fill="#C2185B" />
      <path
        d="M 0 60 Q 30 90, 60 60 Q 90 90, 120 60 Q 150 90, 180 60 Q 210 90, 240 60 Q 270 90, 300 60 Q 330 90, 360 60 L 360 0 L 0 0 Z"
        fill="#C2185B"
      />
      {/* Foco */}
      <circle cx="180" cy="160" r="40" fill="#FFE9A8" opacity="0.7" />
      <circle cx="180" cy="160" r="20" fill="#FFD60A" />
      {/* Butacas */}
      <g transform="translate(50, 220)">
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={i * 45} width="38" height="40" rx="6" fill="#C2185B" />
        ))}
      </g>
    </svg>
  );
}
