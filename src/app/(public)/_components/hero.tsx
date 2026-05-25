"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="px-6 pt-12 pb-16 lg:px-12 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground border border-accent/30">
            <Sparkles className="size-3" />
            Beta abierta — únete primero
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl"
        >
          Vende tickets.
          <br />
          <span className="text-primary">Llena</span> tu noche.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Plataforma todo en uno para crear eventos, vender entradas con QR,
          gestionar promotores y validar en la puerta. Sin comisiones absurdas.
          Hecho para discotecas, festivales y promotoras que quieren cobrar el
          viernes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button size="xl" variant="default" asChild>
            <Link href="/registro">
              Crear mi evento
              <ArrowUpRight className="size-5" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link href="#proximos">Ver eventos</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8 md:grid-cols-4"
        >
          <Stat label="Comisión por ticket" value="2%" />
          <Stat label="Tiempo de set-up" value="5 min" />
          <Stat label="QR firmados HMAC" value="100%" />
          <Stat label="Pagos en España" value="Redsys + Stripe" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold md:text-4xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
