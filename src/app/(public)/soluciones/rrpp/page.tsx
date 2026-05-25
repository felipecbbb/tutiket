import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Equipo RR.PP. · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Soluciones"
      title="Vende más con tu red de RR.PP."
      subtitle="Crea equipos, asigna comisiones por miembro o por evento concreto, comparte links únicos. Cada venta atribuida automáticamente — quien la trajo, cuánto se lleva, cuándo cobra."
      bullets={[
        { title: "Comisiones flexibles", body: "Base por miembro, override por equipo, override por evento. La que aplica gana." },
        { title: "Link de afiliado", body: "Cada RR.PP. tiene un código único. Si una compra entra con su link, se le atribuye." },
        { title: "Equipos multinivel", body: "Manager → miembros. El manager configura comisiones de su equipo." },
        { title: "Liquidaciones", body: "Reporte automático de qué cobra cada RR.PP. tras cada evento. Listo para pagar." },
        { title: "Dashboard del PR", body: "Cada miembro ve sus ventas, comisión acumulada y eventos asignados." },
        { title: "Invitaciones por email", body: "Comparte un link, el RR.PP. crea cuenta, acepta y queda activo en tu org." },
      ]}
      sections={[
        {
          title: "Atribución sin discusiones",
          body: "El código del afiliado viaja con el comprador. Si entra por el link de Marina, la venta es de Marina aunque la pague tres días después. Las comisiones se calculan en céntimos para evitar redondeos absurdos.",
        },
      ]}
    />
  );
}
