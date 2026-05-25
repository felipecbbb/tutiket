import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Club · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Discoteca y club. Cada viernes, sin esfuerzo."
      subtitle="Recurrencia semanal automática, equipo de RR.PP. con comisiones, guest list para tu DJ. Las ventas entran y tu contabilidad se actualiza sola."
      bullets={[
        { title: "Eventos recurrentes", body: "Crea la plantilla 'Viernes Tech' una vez. Se duplica cada semana." },
        { title: "RR.PP. con comisiones", body: "Tu equipo trae gente, cobra su comisión, tú lo ves en tiempo real." },
        { title: "Guest list", body: "Crea listas por DJ, artista o invitado especial. Bulk import desde Excel." },
        { title: "Validación rápida en cola", body: "PWA móvil, escanea en segundos. Sin lectores especiales." },
        { title: "Cupones para fidelizar", body: "Códigos de descuento por cliente recurrente, embajador o campaña." },
        { title: "Aforo en vivo", body: "Sabes cuánta gente queda dentro en tiempo real para gestionar puertas." },
      ]}
    />
  );
}
