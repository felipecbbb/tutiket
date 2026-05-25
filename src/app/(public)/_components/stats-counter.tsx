"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STATS = [
  { value: 2, suffix: "%", label: "Comisión fija", note: "Sin sorpresas, sin mensualidades" },
  { value: 200, suffix: "ms", label: "Validación QR", note: "Por escaneo en la puerta" },
  { value: 100, suffix: "%", label: "Anti-falsificación", note: "Firma HMAC por entrada" },
  { value: 7, suffix: "+", label: "Sectores cubiertos", note: "Deporte, festival, conferencia…" },
];

export function StatsCounter() {
  return (
    <section className="px-6 py-20 lg:px-12 lg:py-24 border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="font-sans text-2xl font-bold tracking-tight md:text-3xl mb-12"
        >
          Por qué funciona <span className="text-muted-foreground">los números no mienten</span>
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeOut }}
            >
              <Counter value={s.value} suffix={s.suffix} />
              <p className="mt-2 font-sans font-bold tracking-tight">{s.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return controls.stop;
  }, [isInView, motionValue, value]);

  return (
    <p ref={ref} className="font-sans text-6xl font-bold tracking-[-0.03em] tabular-nums">
      <span>{display}</span>
      <span className="text-muted-foreground">{suffix}</span>
    </p>
  );
}
