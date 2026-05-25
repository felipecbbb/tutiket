import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Casos de éxito" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Casos de éxito"
      title="Cómo otros organizadores ganan tiempo y dinero."
      subtitle="Estamos recopilando casos reales con nuestros primeros clientes. Si llevas tu propia experiencia con Noa Events y quieres contarla, escríbenos a soporte."
      sections={[
        {
          title: "Lo que solemos escuchar",
          body: "El cambio más mencionado por nuestros clientes es dejar de pelearse con Excel después de cada noche. La contabilidad se actualiza sola, las comisiones de RR.PP. se calculan solas, y el equipo de puerta valida con el móvil sin discusiones.",
        },
        {
          title: "Próximamente",
          body: "Caso 'Sala Berlín' (discoteca semanal en LPGC), caso 'Fest Atlántico' (festival de 3 días), caso 'Liga Insular Pádel' (torneos recurrentes). Suscríbete al newsletter para no perderlos.",
        },
      ]}
    />
  );
}
