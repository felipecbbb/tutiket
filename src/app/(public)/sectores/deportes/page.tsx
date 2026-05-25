import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Eventos deportivos · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Deportes"
      theme="sky"
      title="Carreras, partidos, torneos."
      highlight="torneos"
      subtitle="Inscripciones con datos del corredor, categorías por edad o nivel, dorsales asociados al QR. Listo para 10K, maratones, ligas locales, copas y partidos."
      bullets={[
        { title: "Inscripción con datos", body: "Captura DNI, fecha nacimiento, talla camiseta, contacto emergencia." },
        { title: "Categorías", body: "Senior, junior, élite. Capacidad y precio por categoría." },
        { title: "Dorsales", body: "Asignación automática y exportable a CSV para imprenta." },
        { title: "Pulseras de equipo", body: "Listas de jugadores por equipo con acceso al campo." },
        { title: "Abonos de temporada", body: "Vende 20 partidos en un solo ticket." },
        { title: "Patrocinios", body: "Logos del patrocinador en la página del evento y en el ticket PDF." },
      ]}
      visual={<SportVisual />}
    />
  );
}

function SportVisual() {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" aria-hidden>
      <rect width="360" height="280" rx="24" fill="#CFE2FF" />
      {/* Pista */}
      <ellipse cx="180" cy="180" rx="140" ry="60" fill="none" stroke="#1B5EBA" strokeWidth="3" />
      <ellipse cx="180" cy="180" rx="110" ry="40" fill="none" stroke="#1B5EBA" strokeWidth="2" strokeDasharray="6 4" />
      {/* Dorsales */}
      <g transform="translate(50, 50)">
        <rect width="60" height="60" rx="12" fill="#fff" stroke="#1B5EBA" strokeWidth="2" />
        <text x="30" y="40" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }} fill="#1B5EBA">
          042
        </text>
      </g>
      <g transform="translate(250, 70)">
        <rect width="60" height="60" rx="12" fill="#fff" stroke="#1B5EBA" strokeWidth="2" />
        <text x="30" y="40" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }} fill="#1B5EBA">
          108
        </text>
      </g>
    </svg>
  );
}
