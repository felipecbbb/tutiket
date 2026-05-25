import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Validación QR · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Validación QR"
      theme="mint"
      title="En la puerta, en 200 ms."
      highlight="200 ms"
      subtitle="Tu equipo escanea con cualquier móvil. Sin app que instalar, sin hardware extra. Cada entrada lleva firma HMAC: rechazamos QRs falsos, duplicados, cancelados o de otros eventos al instante."
      bullets={[
        { title: "PWA móvil", body: "Funciona en iPhone y Android sin tienda. Login y empieza." },
        { title: "Sin conexión = sin problema", body: "El scanner funciona offline. Sincroniza cuando vuelve la cobertura." },
        { title: "Multi-puerta", body: "Varios validadores escanean a la vez. Sin doble validación." },
        { title: "Resultado visual + háptico", body: "Verde si OK, rojo si rechazo. Vibración para no mirar." },
        { title: "Asistente nominativo", body: "Muestra nombre y DNI para cotejar entradas nominativas." },
        { title: "Estadísticas en vivo", body: "El organizador ve quién entró, cuántos, cuándo. En tiempo real." },
      ]}
      sections={[
        {
          title: "Cinco estados de validación",
          body: "Ok, duplicada, inválida, evento incorrecto, cancelada. Cada caso con feedback inmediato y registrado en histórico.",
        },
        {
          title: "Permisos finos",
          body: "Asignas validadores a eventos concretos, no a toda la org. Solo escanean lo que les corresponde.",
        },
      ]}
      visual={<ScanVisual />}
    />
  );
}

function ScanVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#D8F3DC" />
      <rect x="120" y="40" width="120" height="200" rx="20" fill="#1d1d1f" />
      <rect x="130" y="55" width="100" height="170" rx="10" fill="#fff" />
      {/* QR */}
      <g transform="translate(150, 80)">
        {[...Array(7)].map((_, r) =>
          [...Array(7)].map((_, c) => {
            const filled = (r + c) % 2 === 0 || (r === 0 && c === 0) || (r === 6 && c === 6);
            return filled ? <rect key={`${r}-${c}`} x={c * 9} y={r * 9} width="8" height="8" fill="#1d1d1f" /> : null;
          }),
        )}
      </g>
      {/* Check verde */}
      <circle cx="180" cy="195" r="14" fill="#1B7E5E" />
      <path d="M 172 195 L 178 201 L 188 191" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <text x="295" y="155" textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2 }} fill="#1B7E5E">200ms</text>
    </svg>
  );
}
