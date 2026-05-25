"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Mic2,
  Music2,
  Trophy,
  Drama,
  Sparkles,
  GlassWater,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Sector = {
  href: string;
  name: string;
  icon: LucideIcon;
  copy: string;
  bg: string;
};

const SECTORS: Sector[] = [
  {
    href: "/sectores/festivales",
    name: "Festivales",
    icon: Music2,
    copy: "Días, escenarios, abonos. Capacidad para 50.000+ asistentes.",
    bg: "from-fuchsia-500/15 to-purple-500/10",
  },
  {
    href: "/sectores/club",
    name: "Discoteca · Club",
    icon: GlassWater,
    copy: "Recurrencia semanal, lista de invitados, equipo RR.PP. con comisiones.",
    bg: "from-amber-500/15 to-orange-500/10",
  },
  {
    href: "/sectores/conciertos",
    name: "Conciertos",
    icon: Mic2,
    copy: "Numeración de butaca, anti-reventa, abonos por gira.",
    bg: "from-sky-500/15 to-blue-500/10",
  },
  {
    href: "/sectores/deportes",
    name: "Eventos deportivos",
    icon: Trophy,
    copy: "Carreras, partidos, torneos. Dorsales, categorías, dorsal+QR.",
    bg: "from-emerald-500/15 to-green-500/10",
  },
  {
    href: "/sectores/conferencias",
    name: "Conferencias",
    icon: Building2,
    copy: "Pases multi-día, badges nominativos, tracks por sala.",
    bg: "from-violet-500/15 to-indigo-500/10",
  },
  {
    href: "/sectores/teatro",
    name: "Teatro y artes",
    icon: Drama,
    copy: "Sesiones, butacas, abonos de temporada.",
    bg: "from-rose-500/15 to-pink-500/10",
  },
  {
    href: "/sectores/privados",
    name: "Privados · galas",
    icon: Sparkles,
    copy: "Bodas, eventos corporativos. Listas cerradas, sin público.",
    bg: "from-yellow-500/15 to-amber-500/10",
  },
];

export function SectorsGrid() {
  return (
    <section className="px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Para todo tipo de evento ·
          </p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight md:text-5xl">
            Funciona igual de bien para una rave que para una conferencia.
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: easeOut }}
              >
                <Link
                  href={s.href}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg"
                >
                  <div
                    className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${s.bg}`}
                  />
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-sans text-lg font-bold tracking-tight">
                    {s.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.copy}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver más
                    <ArrowUpRight className="size-3" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
