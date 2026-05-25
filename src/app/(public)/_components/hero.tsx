"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ScanLine, Sparkles, TrendingUp } from "lucide-react";
import { useRef } from "react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 pt-12 pb-24 lg:px-12 lg:pt-20 lg:pb-32"
    >
      <motion.div
        style={{ y: orbY }}
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-[520px] rounded-full bg-gradient-to-br from-[#FFD7C7] via-[#FFE9A8] to-[#D8F3DC] blur-3xl opacity-70"
      />
      <motion.div
        style={{ y: orbY }}
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-gradient-to-br from-[#E5D9F2] via-[#FFD7E1] to-[#FCE4B6] blur-3xl opacity-60"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3" />
                Conectado con Noa · Tu contabilidad, automática
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: easeOut }}
              className="font-sans text-5xl font-bold leading-[0.98] tracking-[-0.02em] md:text-6xl lg:text-7xl"
            >
              Vende entradas
              <br />
              <span className="relative inline-block">
                como si tuvieras
                <SquiggleUnderline />
              </span>
              <br />
              un CFO al lado.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
              className="mt-7 max-w-xl text-lg text-muted-foreground"
            >
              Noa Events es la ticketera de eventos —{" "}
              <b className="text-foreground">deporte, festivales, conciertos, conferencias</b> —
              que se conecta a{" "}
              <Link href="/nosotros" className="underline underline-offset-4 hover:text-foreground">
                Noa
              </Link>
              , tu asistente personal de finanzas, y deja tu contabilidad lista
              sin que abras Excel.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: easeOut }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                href={isAuthenticated ? "/org" : "/registro"}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
              >
                {isAuthenticated ? "Ir a mi panel" : "Crear evento gratis"}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/recursos/calculadora"
                className="rounded-full border border-foreground/15 bg-background/80 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Calcular mis ingresos
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground"
            >
              <Pill icon={<ScanLine className="size-3" />} text="QR firmados HMAC" />
              <Pill icon={<TrendingUp className="size-3" />} text="Comisión 2% · sin sorpresas" />
              <Pill icon={<Sparkles className="size-3" />} text="Setup en 5 minutos" />
            </motion.div>
          </div>

          <motion.div style={{ y: cardY }} className="relative">
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {text}
    </span>
  );
}

function SquiggleUnderline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 12"
      preserveAspectRatio="none"
      className="absolute -bottom-2 left-0 w-full h-3 text-[#FF6B5B]"
    >
      <motion.path
        d="M2 9 Q 30 1, 60 6 T 120 6 T 180 6 T 218 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
      className="relative"
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute -top-5 -right-2 z-20 rotate-3"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B5B] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
          <span className="size-1.5 rounded-full bg-white animate-pulse" />
          En vivo
        </span>
      </motion.div>

      <div className="rounded-3xl border border-foreground/10 bg-background shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-border bg-card px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FF6B5B]" />
          <span className="size-2.5 rounded-full bg-[#FFD60A]" />
          <span className="size-2.5 rounded-full bg-[#34C759]" />
          <span className="ml-3 font-mono text-[10px] text-muted-foreground">
            noaevents.app/org/sala-berlin
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Sala Berlín
            </p>
            <p className="font-sans font-bold tracking-tight">Lights Off · Sat 28</p>
          </div>
          <span className="rounded-full bg-[#D8F3DC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1B7E5E]">
            Activo
          </span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          <Kpi value="312" label="Vendidas" />
          <Kpi value="84%" label="Ocupación" />
          <Kpi value="4 380 €" label="Ingresos" highlight />
        </div>

        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-medium mb-2">Últimas 24h</p>
          <MiniChart />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex items-center justify-between gap-3 bg-foreground px-5 py-4 text-background"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-background/60">
              Sincronizado con Noa
            </p>
            <p className="mt-0.5 text-sm font-medium truncate">
              +21,76 € netos · IVA 21% repercutido
            </p>
          </div>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="size-2 rounded-full bg-[#34C759] shrink-0"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: -30, x: -10 }}
        animate={{ opacity: 1, rotate: -8, x: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute -bottom-4 -left-4 size-16 rounded-2xl bg-[#FFD60A] grid place-items-center shadow-xl"
      >
        <SmileyFace />
      </motion.div>
    </motion.div>
  );
}

function Kpi({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className={`px-5 py-4 ${highlight ? "bg-[#FFF7E6]" : ""}`}>
      <p className="font-sans text-xl font-bold tracking-tight tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniChart() {
  const points = [12, 18, 14, 22, 19, 26, 24, 32, 28, 36, 34, 42, 38, 50];
  const max = Math.max(...points);
  const w = 280;
  const h = 60;
  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-14 text-[#1B7E5E]">
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#chartFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      />
      <motion.path
        d={path}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function SmileyFace() {
  return (
    <svg viewBox="0 0 32 32" className="size-10 text-foreground" aria-hidden>
      <circle cx="11.5" cy="13" r="1.4" fill="currentColor" />
      <circle cx="20.5" cy="13" r="1.4" fill="currentColor" />
      <path
        d="M10 19 Q 16 24, 22 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
