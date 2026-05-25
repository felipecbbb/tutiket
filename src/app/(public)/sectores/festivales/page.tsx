import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Festivales · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Festivales que vibran."
      subtitle="Cartelera por días, abonos completos o por jornada, varios escenarios, miles de asistentes. La plataforma escala. Tu equipo de RR.PP. y validación, también."
      bullets={[
        { title: "Multi-día con abonos", body: "Vende abono completo o entrada por jornada. Cada modalidad con su precio." },
        { title: "Escenarios y categorías", body: "Etiqueta cada entrada con escenario o zona — VIP pit, general, backstage." },
        { title: "Validación masiva", body: "Decenas de puertas escaneando en paralelo. Sin colapsos." },
        { title: "Pulsera + QR", body: "Imprime el QR en la pulsera del festival. Una sola validación por día." },
        { title: "Mayoría de edad", body: "Captura DNI obligatorio en entradas con alcohol o +18." },
        { title: "Patrocinadores", body: "Páginas de evento con logos de marcas patrocinadoras." },
      ]}
    />
  );
}
