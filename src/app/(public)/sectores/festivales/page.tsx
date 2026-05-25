import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Festivales · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Festivales"
      theme="coral"
      title="Festivales que vibran."
      highlight="vibran"
      subtitle="Cartelera por días, abonos completos o por jornada, varios escenarios, miles de asistentes. La plataforma escala. Tu equipo de RR.PP. y validación, también."
      bullets={[
        { title: "Multi-día con abonos", body: "Vende abono completo o entrada por jornada. Cada modalidad con su precio." },
        { title: "Escenarios y categorías", body: "Etiqueta cada entrada con escenario o zona: VIP pit, general, backstage." },
        { title: "Validación masiva", body: "Decenas de puertas escaneando en paralelo. Sin colapsos." },
        { title: "Pulsera + QR", body: "Imprime el QR en la pulsera del festival. Una sola validación por día." },
        { title: "Mayoría de edad", body: "Captura DNI obligatorio en entradas con alcohol o +18." },
        { title: "Patrocinadores", body: "Páginas de evento con logos de marcas patrocinadoras." },
      ]}
      visual={<FestivalVisual />}
    />
  );
}

function FestivalVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <defs>
        <linearGradient id="festSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="100%" stopColor="#FFD7C7" />
        </linearGradient>
      </defs>
      <rect width="360" height="280" rx="24" fill="url(#festSky)" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M ${40 + i * 110} 220 L ${85 + i * 110} 90 L ${130 + i * 110} 220 Z`}
            fill="#1d1d1f"
            opacity={0.85 - i * 0.15}
          />
        </g>
      ))}
      <circle cx="290" cy="60" r="32" fill="#FF6B5B" />
      <g transform="translate(40, 240)">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={i * 35 + 10} cy="0" r="6" fill="#1d1d1f" opacity="0.6" />
        ))}
      </g>
    </svg>
  );
}
