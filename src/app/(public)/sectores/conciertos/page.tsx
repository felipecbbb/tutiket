import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Conciertos · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Conciertos: cada ticket vale lo que debe."
      subtitle="Numeración de butaca, anti-reventa con QR único por persona, abonos por gira o ciclo. Pensado para giras, salas de música en vivo y promotores."
      bullets={[
        { title: "Anti-reventa", body: "QR nominativo + DNI. Un revendedor no puede entrar en lugar del comprador." },
        { title: "Numeración", body: "Asigna butaca o zona en el flujo de compra." },
        { title: "Abonos de ciclo", body: "Vende paquete de 4 conciertos a precio reducido. Mismo QR para todos." },
        { title: "Programación", body: "Calendario con todas tus fechas. Tu público navega y compra cualquiera." },
        { title: "Cancelaciones suaves", body: "Si cae un concierto, reembolso en bloque con un clic." },
      ]}
    />
  );
}
