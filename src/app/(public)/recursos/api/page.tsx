import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "API y desarrolladores" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Para desarrolladores"
      title="API y webhooks."
      subtitle="Si necesitas integrar Noa Events con tu CRM, web propia o sistema de control de aforo, tenemos una API REST y webhooks para eventos clave (compra confirmada, validación, reembolso)."
      bullets={[
        { title: "REST + JSON", body: "Endpoints simples: GET /events, POST /tickets/purchase, GET /tickets/:id." },
        { title: "Webhooks", body: "Recibe notificación cada vez que se vende una entrada, se valida o se reembolsa." },
        { title: "OAuth2", body: "Tu integración pide permiso al organizador antes de leer datos." },
        { title: "Rate limits razonables", body: "100 req/min por defecto. Si necesitas más, escríbenos." },
        { title: "Documentación abierta", body: "Endpoints, schemas, ejemplos en curl/JS. (En preparación)" },
      ]}
      sections={[
        {
          title: "Disponibilidad",
          body: "La API pública entra en beta cuando tengamos las primeras integraciones funcionando con clientes reales. Si tienes una integración concreta que quieres montar, escríbenos y te damos acceso early.",
        },
      ]}
      cta={{ href: "/nosotros/contacto", label: "Pedir acceso a API" }}
    />
  );
}
