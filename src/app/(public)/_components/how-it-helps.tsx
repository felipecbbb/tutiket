"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    n: "01",
    color: "#FFD7C7",
    accent: "#FF6B5B",
    title: "Creas tu evento",
    body:
      "Sin formularios infinitos. Pones nombre, fecha, aforo, tipos de entrada (general, VIP, early bird, guestlist). Subes el cartel.",
    visual: <CreateVisual />,
  },
  {
    n: "02",
    color: "#D8F3DC",
    accent: "#1B7E5E",
    title: "Vendes desde el primer minuto",
    body:
      "Tu página de evento sale en Noa Events. Aceptamos tarjeta, Bizum y Redsys. Sin coste fijo — solo pagas cuando vendes.",
    visual: <SellVisual />,
  },
  {
    n: "03",
    color: "#FFE9A8",
    accent: "#B58900",
    title: "Validas en la puerta con el móvil",
    body:
      "Tu equipo escanea con cualquier smartphone. Firma HMAC anti-falsificación. 200ms por escaneo, sin filas.",
    visual: <ValidateVisual />,
  },
  {
    n: "04",
    color: "#E5D9F2",
    accent: "#6D28D9",
    title: "Tu contabilidad se actualiza sola",
    body:
      "Cada venta entra como ingreso categorizado en Noa. IVA, comisiones de RR.PP., reembolsos — todo apuntado.",
    visual: <AccountingVisual />,
  },
];

export function HowItHelps() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Cómo funciona ·
          </p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-[-0.02em] md:text-6xl leading-[1.02]">
            Cuatro pasos. Cero dolor.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Línea vertical de progreso */}
          <div className="absolute left-7 top-2 bottom-2 w-px bg-border hidden md:block">
            <motion.div
              style={{ height: progressHeight }}
              className="w-full bg-foreground origin-top"
            />
          </div>

          <ol className="space-y-16">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: easeOut }}
                className="grid gap-8 md:grid-cols-[60px_1fr_1.2fr] items-start"
              >
                {/* Número */}
                <div className="relative md:pl-1">
                  <div
                    className="size-14 rounded-2xl grid place-items-center shadow-lg"
                    style={{ backgroundColor: s.color }}
                  >
                    <span
                      className="font-sans text-lg font-bold tracking-tight"
                      style={{ color: s.accent }}
                    >
                      {s.n}
                    </span>
                  </div>
                </div>

                {/* Texto */}
                <div>
                  <h3 className="font-sans text-2xl font-bold tracking-[-0.01em] md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                </div>

                {/* Visual SVG */}
                <div
                  className="relative overflow-hidden rounded-2xl border border-border p-6"
                  style={{ backgroundColor: `${s.color}80` }}
                >
                  {s.visual}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───── Visuales SVG por paso ───── */

function CreateVisual() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto">
      <rect x="20" y="20" width="280" height="20" rx="6" fill="#fff" />
      <rect x="20" y="20" width="120" height="20" rx="6" fill="#FF6B5B" />
      <text x="30" y="35" style={{ fontSize: 11, fontFamily: "monospace" }} fill="#fff">
        Nombre del evento
      </text>
      <rect x="20" y="55" width="130" height="14" rx="4" fill="#fff" opacity="0.7" />
      <rect x="160" y="55" width="80" height="14" rx="4" fill="#fff" opacity="0.5" />

      <rect x="20" y="85" width="280" height="35" rx="6" fill="#fff" />
      <text x="30" y="106" style={{ fontSize: 10 }} fill="#7a6f60">
        General — 15 €
      </text>
      <rect x="220" y="93" width="60" height="18" rx="9" fill="#FF6B5B" />
      <text x="250" y="106" textAnchor="middle" style={{ fontSize: 10, fontWeight: 700 }} fill="#fff">
        + Añadir
      </text>

      <motion.rect
        initial={{ width: 0 }}
        whileInView={{ width: 280 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        x="20"
        y="135"
        height="35"
        rx="17"
        fill="#1d1d1f"
      />
      <text x="160" y="158" textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} fill="#fff">
        Publicar evento
      </text>
    </svg>
  );
}

function SellVisual() {
  const bars = [40, 55, 30, 70, 50, 90, 75, 110, 95];
  const maxBar = Math.max(...bars);
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto">
      <text x="20" y="30" style={{ fontSize: 11, fontWeight: 700 }} fill="#1d1d1f">
        Ventas hoy
      </text>
      <text x="290" y="30" textAnchor="end" style={{ fontSize: 18, fontWeight: 700 }} fill="#1B7E5E">
        +12 4€
      </text>

      <g transform="translate(20, 50)">
        {bars.map((b, i) => (
          <motion.rect
            key={i}
            initial={{ height: 0, y: 110 }}
            whileInView={{ height: (b / maxBar) * 110, y: 110 - (b / maxBar) * 110 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: "easeOut" }}
            x={i * 32}
            width="20"
            rx="4"
            fill="#1B7E5E"
          />
        ))}
      </g>
    </svg>
  );
}

function ValidateVisual() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto">
      {/* Móvil */}
      <rect x="100" y="20" width="120" height="140" rx="16" fill="#1d1d1f" />
      <rect x="108" y="30" width="104" height="120" rx="6" fill="#fff" />

      {/* QR */}
      <g transform="translate(124, 50)">
        {[...Array(7)].map((_, r) =>
          [...Array(7)].map((_, c) => {
            const filled = (r + c) % 2 === 0 || (r === 0 && c === 0) || (r === 6 && c === 6);
            return filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * 10}
                y={r * 10}
                width="9"
                height="9"
                fill="#1d1d1f"
              />
            ) : null;
          }),
        )}
      </g>

      {/* Línea escáner */}
      <motion.line
        x1="124"
        x2="194"
        y1="60"
        y2="60"
        stroke="#FF6B5B"
        strokeWidth="2"
        animate={{ y1: [60, 120, 60], y2: [60, 120, 60] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Check */}
      <motion.g
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        transform="translate(232, 90)"
      >
        <circle cx="0" cy="0" r="18" fill="#1B7E5E" />
        <path d="M -7 0 L -2 5 L 7 -5" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function AccountingVisual() {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-auto">
      <rect x="20" y="20" width="280" height="36" rx="8" fill="#fff" />
      <circle cx="40" cy="38" r="8" fill="#1B7E5E" />
      <text x="58" y="36" style={{ fontSize: 11, fontWeight: 600 }} fill="#1d1d1f">
        Ingreso ticket general
      </text>
      <text x="58" y="50" style={{ fontSize: 9 }} fill="#7a6f60">
        15,00 € · IVA 21%
      </text>
      <text x="280" y="42" textAnchor="end" style={{ fontSize: 13, fontWeight: 700 }} fill="#1B7E5E">
        +15,00
      </text>

      <rect x="20" y="65" width="280" height="36" rx="8" fill="#fff" />
      <circle cx="40" cy="83" r="8" fill="#FF6B5B" />
      <text x="58" y="81" style={{ fontSize: 11, fontWeight: 600 }} fill="#1d1d1f">
        Comisión RR.PP. Marina
      </text>
      <text x="58" y="95" style={{ fontSize: 9 }} fill="#7a6f60">
        Gasto · 15% de la venta
      </text>
      <text x="280" y="87" textAnchor="end" style={{ fontSize: 13, fontWeight: 700 }} fill="#FF6B5B">
        −2,25
      </text>

      <rect x="20" y="110" width="280" height="36" rx="8" fill="#fff" />
      <circle cx="40" cy="128" r="8" fill="#6D28D9" />
      <text x="58" y="126" style={{ fontSize: 11, fontWeight: 600 }} fill="#1d1d1f">
        IVA repercutido 21%
      </text>
      <text x="58" y="140" style={{ fontSize: 9 }} fill="#7a6f60">
        Pendiente liquidar trimestre
      </text>
      <text x="280" y="132" textAnchor="end" style={{ fontSize: 13, fontWeight: 700 }} fill="#6D28D9">
        −3,15
      </text>

      <motion.line
        x1="20"
        x2="300"
        y1="155"
        y2="155"
        stroke="#1d1d1f"
        strokeWidth="1"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <text x="160" y="170" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }} fill="#1d1d1f">
        Neto Noa: 9,60 €
      </text>
    </svg>
  );
}
