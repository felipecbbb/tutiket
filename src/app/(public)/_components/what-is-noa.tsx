"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calculator, Wallet } from "lucide-react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function WhatIsNoa() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-32 bg-[#0F1115] text-background">
      {/* Trama decorativa */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <DotPattern />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="grid gap-12 lg:grid-cols-[1fr_1.3fr] items-center"
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-background/50">
              · ¿Quién es Noa? ·
            </p>
            <h2 className="mt-3 font-sans text-4xl font-bold tracking-[-0.02em] md:text-5xl leading-[1.05]">
              Tu asistente personal con IA. Ahora también, para tus eventos.
            </h2>
            <p className="mt-6 text-background/70 md:text-lg">
              <a
                href="https://heynoa.es"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-background underline underline-offset-4 decoration-[#FF6B5B]"
              >
                Noa
              </a>{" "}
              es la primera plataforma que organiza tus finanzas, facturación,
              clientes y productividad en un solo lugar. Conectas tus bancos,
              tus apps, y te devuelve el control. Noa Events extiende esa misma
              filosofía a los eventos: vende, cobra y contabiliza, todo
              encadenado.
            </p>
            <a
              href="https://heynoa.es"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-background hover:opacity-80"
            >
              Visita heynoa.es
              <ArrowRight className="size-4" />
            </a>
          </div>

          {/* Diagrama de conexión */}
          <NoaDiagram />
        </motion.div>

        {/* 3 cosas que Noa hace */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          className="mt-20 grid gap-4 md:grid-cols-3"
        >
          <NoaCapability
            icon={<Wallet className="size-5" />}
            title="Conecta tus bancos"
            body="Bizum, BBVA, ING, Santander y más. Noa lee tus movimientos y los categoriza."
          />
          <NoaCapability
            icon={<Calculator className="size-5" />}
            title="Calcula impuestos"
            body="IVA trimestral, IRPF, pago fraccionado. Sin sustos de Hacienda."
          />
          <NoaCapability
            icon={<BadgeCheck className="size-5" />}
            title="Emite facturas"
            body="Con tus datos fiscales. Modelo 303, 130, 200. Listo para descargar."
          />
        </motion.div>
      </div>
    </section>
  );
}

function NoaCapability({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-background/15 bg-background/[0.04] p-6 backdrop-blur">
      <div className="inline-flex size-10 items-center justify-center rounded-xl bg-background text-foreground">
        {icon}
      </div>
      <p className="mt-4 font-sans font-bold tracking-tight">{title}</p>
      <p className="mt-1.5 text-sm text-background/65">{body}</p>
    </div>
  );
}

function NoaDiagram() {
  return (
    <svg
      viewBox="0 0 520 360"
      className="w-full h-auto"
      role="img"
      aria-label="Diagrama de Noa Events conectándose con bancos y Noa"
    >
      {/* Líneas conectoras */}
      <motion.g
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
        }}
      >
        <ConnectorLine d="M 120 90 Q 200 90, 260 170" />
        <ConnectorLine d="M 120 180 Q 200 180, 260 180" />
        <ConnectorLine d="M 120 270 Q 200 270, 260 190" />
        <ConnectorLine d="M 320 180 L 380 180" />
      </motion.g>

      {/* Nodos izquierda — fuentes */}
      <Node x={20} y={60} label="Eventos" sub="Noa Events" filled />
      <Node x={20} y={150} label="Bancos" sub="Bizum, BBVA…" />
      <Node x={20} y={240} label="Apps" sub="Stripe, Redsys" />

      {/* Nodo central — Noa */}
      <motion.g
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <rect
          x="240"
          y="140"
          width="80"
          height="80"
          rx="20"
          className="fill-background"
        />
        <text
          x="280"
          y="186"
          textAnchor="middle"
          className="fill-foreground font-bold"
          style={{ fontSize: 22, fontFamily: "var(--font-sans)" }}
        >
          noa
        </text>
      </motion.g>

      {/* Nodo derecha — outputs */}
      <Node x={380} y={150} label="Contabilidad" sub="Auto-categorizada" filled />

      {/* Burbuja resultado */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <rect x="380" y="250" width="120" height="70" rx="14" fill="#FF6B5B" />
        <text x="440" y="280" textAnchor="middle" className="fill-white" style={{ fontSize: 11, fontWeight: 600 }}>
          IVA · Modelo 303
        </text>
        <text x="440" y="300" textAnchor="middle" className="fill-white/80" style={{ fontSize: 10 }}>
          Listo cada trimestre
        </text>
      </motion.g>
    </svg>
  );
}

function Node({
  x,
  y,
  label,
  sub,
  filled,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  filled?: boolean;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <rect
        x={x}
        y={y}
        width="100"
        height="60"
        rx="14"
        className={filled ? "fill-[#FF6B5B]" : "fill-background/10"}
        stroke="currentColor"
        strokeOpacity={filled ? 0 : 0.25}
      />
      <text
        x={x + 50}
        y={y + 28}
        textAnchor="middle"
        className={filled ? "fill-white font-bold" : "fill-background font-bold"}
        style={{ fontSize: 13 }}
      >
        {label}
      </text>
      <text
        x={x + 50}
        y={y + 46}
        textAnchor="middle"
        className={filled ? "fill-white/75" : "fill-background/60"}
        style={{ fontSize: 10 }}
      >
        {sub}
      </text>
    </motion.g>
  );
}

function ConnectorLine({ d }: { d: string }) {
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeOpacity="0.25"
      fill="none"
      strokeDasharray="4 4"
      className="text-background"
      variants={{
        hidden: { pathLength: 0 },
        visible: { pathLength: 1, transition: { duration: 0.7, ease: "easeOut" } },
      }}
    />
  );
}

function DotPattern() {
  return (
    <svg width="100%" height="100%">
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}
