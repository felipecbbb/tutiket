"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Megaphone,
  Receipt,
  ScanLine,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: Ticket,
    title: "Múltiples tipos de entrada",
    body: "General, VIP, early bird, guestlist. Precios, límites por usuario y ventanas de venta independientes.",
  },
  {
    icon: ScanLine,
    title: "Validación QR imposible de falsificar",
    body: "Cada entrada lleva una firma HMAC. Tu equipo escanea desde el móvil y el sistema valida en tiempo real.",
  },
  {
    icon: Megaphone,
    title: "RR.PP. con comisiones",
    body: "Crea equipos, asigna miembros, configura comisiones por evento. Cada venta atribuida al PR correspondiente.",
  },
  {
    icon: Users,
    title: "Listas de invitados",
    body: "Bulk import desde CSV, export, prepagados vs free. Cada invitado con su QR único.",
  },
  {
    icon: CreditCard,
    title: "Pagos con Stripe y Redsys",
    body: "Tarjeta, Bizum y TPV bancario español. Comisiones bajas, sin sorpresas.",
  },
  {
    icon: Receipt,
    title: "Contabilidad automática (Noa)",
    body: "Cada venta se sincroniza con tu cuenta Noa. IVA, ingresos, facturas — todo categorizado solo.",
    highlight: true,
  },
  {
    icon: BarChart3,
    title: "Estadísticas en vivo",
    body: "Ventas, ingresos, ocupación, top entradas, asistencia. Toma decisiones con datos reales.",
  },
  {
    icon: Calendar,
    title: "Eventos de todo tipo",
    body: "Conciertos, festivales, partidos, conferencias, fiestas, bodas. Personaliza tu página por evento.",
  },
  {
    icon: TrendingUp,
    title: "Twinpoints loyalty",
    body: "Premia a tus clientes. Acumulan puntos con cada compra y los canjean por experiencias.",
  },
];

export function Features() {
  return (
    <section id="caracteristicas" className="px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Lo que incluye ·
          </p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight md:text-5xl">
            Todo lo de una ticketera pro.{" "}
            <span className="text-muted-foreground">Más tu contabilidad.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Vendes tickets, llenas tu evento, validas en la puerta — y tus
            cuentas se actualizan solas en Noa. Sin Excel, sin doble entrada.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: (i % 3) * 0.07,
                  ease: easeOut,
                }}
                className={`group rounded-2xl border p-6 transition-all hover:-translate-y-0.5 ${
                  f.highlight
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card hover:border-foreground/40"
                }`}
              >
                <div
                  className={`inline-flex size-10 items-center justify-center rounded-xl ${
                    f.highlight ? "bg-background/15" : "bg-muted"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-sans text-lg font-bold tracking-tight">
                  {f.title}
                </h3>
                <p
                  className={`mt-1.5 text-sm ${
                    f.highlight ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
