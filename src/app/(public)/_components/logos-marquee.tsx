"use client";

import { motion } from "framer-motion";

const PLACEHOLDER_BRANDS = [
  "Sala Berlín",
  "Fest Atlántico",
  "Liga Insular",
  "Lounge Mare",
  "Club Caleta",
  "TechSummit",
  "Beach Sessions",
  "Teatro Pérez",
];

export function LogosMarquee() {
  return (
    <section className="border-y border-border bg-card/30 py-8">
      <p className="text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Confían en Noa Events
      </p>
      <div className="mt-5 relative overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...PLACEHOLDER_BRANDS, ...PLACEHOLDER_BRANDS, ...PLACEHOLDER_BRANDS].map(
            (name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-2xl font-sans font-bold text-muted-foreground/40 tracking-tight shrink-0"
              >
                {name}
              </span>
            ),
          )}
        </motion.div>
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-card to-transparent" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-card to-transparent" />
      </div>
    </section>
  );
}
