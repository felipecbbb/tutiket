import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Conciertos · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Conciertos"
      theme="mint"
      title="Cada ticket vale lo que debe."
      highlight="vale lo que debe"
      subtitle="Numeración de butaca, anti-reventa con QR único por persona, abonos por gira o ciclo. Pensado para giras, salas de música en vivo y promotores."
      bullets={[
        { title: "Anti-reventa", body: "QR nominativo + DNI. Un revendedor no puede entrar en lugar del comprador." },
        { title: "Numeración", body: "Asigna butaca o zona en el flujo de compra." },
        { title: "Abonos de ciclo", body: "Vende paquete de 4 conciertos a precio reducido. Mismo QR para todos." },
        { title: "Programación", body: "Calendario con todas tus fechas. Tu público navega y compra cualquiera." },
        { title: "Cancelaciones suaves", body: "Si cae un concierto, reembolso en bloque con un clic." },
      ]}
      visual={<ConcertVisual />}
    />
  );
}

function ConcertVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#D8F3DC" />
      {/* Filas de butacas */}
      {[0, 1, 2, 3].map((row) => (
        <g key={row} transform={`translate(40, ${80 + row * 35})`}>
          {[...Array(8)].map((_, i) => {
            const isSold = (row + i) % 3 === 0;
            return (
              <rect
                key={i}
                x={i * 35}
                width="28"
                height="22"
                rx="5"
                fill={isSold ? "#1B7E5E" : "#fff"}
                stroke="#1B7E5E"
                strokeWidth="1.5"
              />
            );
          })}
        </g>
      ))}
      {/* Escenario */}
      <rect x="40" y="40" width="280" height="22" rx="6" fill="#1d1d1f" />
      <text x="180" y="56" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} fill="#fff">
        ESCENARIO
      </text>
    </svg>
  );
}
