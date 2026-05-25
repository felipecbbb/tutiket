"use client";

import { motion } from "framer-motion";
import { ArrowRight, Link2, Sparkles } from "lucide-react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function NoaBanner() {
  return (
    <section className="px-6 py-20 lg:px-12 lg:py-28 bg-muted/40 border-y border-border">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center"
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              · Un servicio de Noa ·
            </p>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight md:text-5xl leading-[1.05]">
              Tus eventos hablan con tu contabilidad.
            </h2>
            <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
              Cada entrada vendida, cada comisión a un RR.PP., cada reembolso
              — se sincroniza automáticamente con tu cuenta{" "}
              <b className="text-foreground">Noa</b>. Tu asistente personal de
              finanzas categoriza los movimientos, calcula tus impuestos y te
              avisa de cuotas trimestrales sin que tengas que abrir Excel.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://heynoa.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                Conoce Noa
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative rounded-3xl border border-border bg-background p-6">
            <div className="space-y-3">
              <Row icon={<Sparkles className="size-4" />} label="Venta confirmada" value="+34,00 €" type="in" />
              <Row label="Comisión PR" value="−5,10 €" type="out" />
              <Row label="IVA repercutido (21%)" value="−7,14 €" type="out" />
              <Row label="Neto a contabilizar" value="21,76 €" type="in" emphasis />
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link2 className="size-3" />
                Sincronizado con Noa hace 2s
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  value,
  type,
  emphasis,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  type: "in" | "out";
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        emphasis ? "border-t border-border pt-3" : ""
      }`}
    >
      <span className="inline-flex items-center gap-2 text-sm">
        {icon}
        {label}
      </span>
      <span
        className={`font-sans font-bold tabular-nums ${
          emphasis ? "text-lg" : "text-sm"
        } ${type === "in" ? "text-[#34C759]" : "text-[#FF3B30]"}`}
      >
        {value}
      </span>
    </div>
  );
}
