import type { Metadata } from "next";
import { MarketingPage } from "@/components/shared/marketing-page";

export const metadata: Metadata = { title: "Validación QR · Soluciones" };

export default function Page() {
  return (
    <MarketingPage
      eyebrow="Soluciones"
      title="Validación QR en la puerta. En 200 ms."
      subtitle="Tu equipo escanea con cualquier móvil. Sin app que instalar, sin hardware extra. Cada entrada lleva firma HMAC: rechazamos QRs falsos, duplicados, cancelados o de otros eventos al instante."
      bullets={[
        { title: "PWA móvil", body: "Funciona en iPhone y Android sin tienda. Tu validador se loguea y empieza." },
        { title: "Sin conexión = sin problema", body: "El scanner funciona offline. Se sincroniza cuando vuelve la cobertura." },
        { title: "Multi-puerta", body: "Varios validadores escanean a la vez. La BD evita doble validación." },
        { title: "Resultado visual + háptico", body: "Pantalla verde si OK, roja si rechazo. Vibración móvil para no mirar." },
        { title: "Asistente nominativo", body: "Si la entrada es nominativa, el validador ve el nombre y DNI para cotejar." },
        { title: "Estadísticas en vivo", body: "El organizador ve quién ha entrado, cuántos, cuándo. En tiempo real." },
      ]}
      sections={[
        {
          title: "Cinco estados de validación",
          body: "Ok · Duplicada (ya fue usada) · Inválida (QR mal firmado) · Wrong event (entrada de otro evento) · Cancelled (ticket reembolsado). Cada caso con feedback inmediato y registrado en histórico.",
        },
        {
          title: "Permisos finos",
          body: "Asignas validadores a eventos concretos, no a toda la org. Solo escanean lo que les corresponde.",
        },
      ]}
    />
  );
}
