"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const COMMISSION = 0.02; // 2%

export function CommissionCalculator() {
  const [tickets, setTickets] = useState(300);
  const [price, setPrice] = useState(25);

  const numbers = useMemo(() => {
    const gross = tickets * price;
    const fee = gross * COMMISSION;
    const net = gross - fee;
    return { gross, fee, net };
  }, [tickets, price]);

  return (
    <section className="px-6 py-20 lg:px-12 lg:py-28 bg-foreground text-background">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-background/60">
            · Calculadora ·
          </p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight md:text-5xl">
            ¿Cuánto te llevas neto?
          </h2>
          <p className="mt-3 text-background/70 max-w-xl mx-auto">
            Mueve los sliders. Nuestra comisión es del 2% — fija, sin sorpresas.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
          <div className="space-y-8">
            <Slider
              label="Entradas vendidas"
              value={tickets}
              min={10}
              max={5000}
              step={10}
              onChange={setTickets}
              format={(v) => v.toLocaleString("es-ES")}
            />
            <Slider
              label="Precio medio por entrada"
              value={price}
              min={1}
              max={200}
              step={1}
              onChange={setPrice}
              format={(v) => `${v} €`}
            />
          </div>

          <motion.div
            key={`${tickets}-${price}`}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-background/5 border border-background/10 p-8"
          >
            <Row label="Facturación bruta" value={numbers.gross} />
            <Row label="Comisión Noa Events (2%)" value={-numbers.fee} sub />
            <div className="mt-6 border-t border-background/15 pt-6">
              <p className="text-xs uppercase tracking-widest text-background/60">
                Te quedas
              </p>
              <p className="mt-1 font-sans text-5xl font-bold tabular-nums">
                {formatEur(numbers.net)}
              </p>
              <p className="mt-2 text-xs text-background/60">
                + Noa actualiza tu contabilidad solo · IVA categorizado · facturas
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-background/70">{label}</span>
        <span className="font-sans font-bold tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-3 w-full accent-background"
      />
    </label>
  );
}

function Row({ label, value, sub }: { label: string; value: number; sub?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={`text-sm ${sub ? "text-background/60" : "text-background/80"}`}>
        {label}
      </span>
      <span
        className={`font-sans tabular-nums ${sub ? "text-background/60 text-sm" : "text-lg font-medium"}`}
      >
        {formatEur(value)}
      </span>
    </div>
  );
}

function formatEur(v: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}
