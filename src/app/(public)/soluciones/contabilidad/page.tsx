import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Contabilidad con Noa · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Soluciones · El diferencial"
      title="Tus eventos hablan con tu contabilidad."
      subtitle="Cada venta, cada comisión, cada reembolso — se sincroniza automáticamente con tu cuenta de Noa. IVA categorizado, facturas a clientes, cuotas trimestrales calculadas. Cero Excel."
      bullets={[
        { title: "Conexión 1-clic", body: "Vinculas tu Noa una vez. Desde entonces, todo fluye solo." },
        { title: "Categorización automática", body: "Ingresos por evento, comisiones PR como gasto, devoluciones — todo etiquetado." },
        { title: "IVA repercutido y soportado", body: "Calculamos qué corresponde a Hacienda en cada compra. Listo para tu modelo 303." },
        { title: "Facturas automáticas", body: "Si tu comprador es empresa y pide factura, se emite con tus datos fiscales." },
        { title: "Modelo 130 / 200", body: "Noa estima tu pago fraccionado en función de tus ventas reales. Sin sustos." },
        { title: "Dashboard único", body: "Ves tus eventos y tus finanzas en un solo lugar. Decisión inmediata." },
      ]}
      sections={[
        {
          title: "Cómo funciona",
          body: "Cuando se confirma una venta en Noa Events, se crea automáticamente un movimiento en tu Noa con el desglose: bruto, comisión Noa Events, IVA repercutido, comisión PR si la hay, neto. Tú no haces nada. Si reembolsas, se genera el movimiento inverso.",
        },
        {
          title: "¿Y si aún no tengo Noa?",
          body: "Puedes seguir vendiendo sin conectar Noa. Tu panel de Noa Events ya te muestra ingresos, top eventos y ocupación. Cuando te apetezca dar el salto a contabilidad automática, lo conectas en 30 segundos.",
        },
      ]}
    />
  );
}
