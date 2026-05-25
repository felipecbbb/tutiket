import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Teatro · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Teatro y artes escénicas."
      subtitle="Sesiones diarias, butacas numeradas, abonos de temporada. Pensado para teatros municipales, compañías independientes, salas de música clásica."
      bullets={[
        { title: "Múltiples funciones", body: "Una obra, muchas sesiones. Cada una con su aforo y precio." },
        { title: "Butaca numerada", body: "Mapa interactivo del teatro. El comprador elige asiento." },
        { title: "Abonos de temporada", body: "Vende toda la temporada a precio reducido en un único ticket." },
        { title: "Descuentos jóvenes / mayores", body: "Cupones por colectivo con verificación opcional." },
        { title: "Programa cultural", body: "Página del teatro con calendario completo de funciones." },
      ]}
    />
  );
}
