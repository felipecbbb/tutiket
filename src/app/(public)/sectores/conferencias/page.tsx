import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Conferencias · Sectores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Sectores"
      title="Conferencias profesionales."
      subtitle="Pases multi-día, badges nominativos con datos del asistente, tracks paralelos por sala. Para summits tecnológicos, congresos, eventos corporativos."
      bullets={[
        { title: "Badges con QR", body: "PDF imprimible con nombre, empresa y QR personalizado." },
        { title: "Tracks por sala", body: "Asignas tickets a sala A o B. Validación filtra por track." },
        { title: "Patrocinadores tier", body: "Gold, Silver, Bronze. Logos según tier en la página." },
        { title: "Facturación a empresa", body: "El comprador indica datos de empresa, se genera factura con IVA." },
        { title: "Networking opcional", body: "Lista de asistentes (opt-in) accesible desde el evento." },
      ]}
    />
  );
}
