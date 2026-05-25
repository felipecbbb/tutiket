import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Eventos deportivos · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Carreras, partidos, torneos."
      subtitle="Inscripciones con datos del corredor, categorías por edad o nivel, dorsales asociados al QR. Listo para 10K, maratones, ligas locales, copas y partidos."
      bullets={[
        { title: "Inscripción con datos", body: "Captura DNI, fecha nacimiento, talla camiseta, contacto emergencia." },
        { title: "Categorías", body: "Senior, junior, élite. Capacidad y precio por categoría." },
        { title: "Dorsales", body: "Asignación automática y exportable a CSV para imprenta." },
        { title: "Pulseras de equipo", body: "Listas de jugadores por equipo con acceso al campo." },
        { title: "Abonos de temporada", body: "Vende 20 partidos en un solo ticket." },
        { title: "Patrocinios", body: "Logos del patrocinador en la página del evento y en el ticket PDF." },
      ]}
    />
  );
}
