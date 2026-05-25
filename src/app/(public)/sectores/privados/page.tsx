import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Eventos privados · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Bodas, galas, eventos corporativos."
      subtitle="Lista cerrada de invitados — no aparece en la web pública, sólo accesible con link directo. Confirmaciones, menús, acompañantes, todo lo que un evento privado necesita."
      bullets={[
        { title: "Evento no público", body: "No se lista en Noa Events. Solo quien tenga el link puede acceder." },
        { title: "RSVP rápido", body: "Tu invitado confirma asistencia y elige menú en 30 segundos." },
        { title: "Acompañantes", body: "Cada invitado declara cuántos vienen y sus nombres." },
        { title: "Restricciones alimentarias", body: "Veggie, vegano, sin gluten — todo recogido por invitado." },
        { title: "Lista para catering", body: "Export CSV con cabezas, menús y notas para el evento." },
      ]}
    />
  );
}
