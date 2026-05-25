"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type MenuKey = "soluciones" | "sectores" | "recursos" | "nosotros";

const MENU = {
  soluciones: {
    label: "Soluciones",
    items: [
      {
        href: "/soluciones/ticketing",
        title: "Ticketing",
        desc: "Múltiples tipos de entrada, ventanas de venta, límites por usuario.",
      },
      {
        href: "/soluciones/validacion",
        title: "Validación QR",
        desc: "Escaneo móvil con firma HMAC. Imposible falsificar.",
      },
      {
        href: "/soluciones/rrpp",
        title: "Equipo RR.PP.",
        desc: "Comisiones por miembro o evento. Links de afiliado únicos.",
      },
      {
        href: "/soluciones/contabilidad",
        title: "Contabilidad con Noa",
        desc: "Cada venta sincronizada automáticamente. IVA y facturas.",
      },
    ],
  },
  sectores: {
    label: "Sectores",
    items: [
      { href: "/sectores/festivales", title: "Festivales", desc: "Cartel, días, tipos de abono." },
      { href: "/sectores/club", title: "Discoteca / Club", desc: "Recurrencia semanal, RR.PP., guest list." },
      { href: "/sectores/conciertos", title: "Conciertos", desc: "Tickets numerados, anti-reventa." },
      { href: "/sectores/deportes", title: "Eventos deportivos", desc: "Carreras, partidos, torneos." },
      { href: "/sectores/conferencias", title: "Conferencias", desc: "Pases multi-día, badges nominativos." },
      { href: "/sectores/teatro", title: "Teatro y artes", desc: "Sesiones, butacas, abonos." },
      { href: "/sectores/privados", title: "Eventos privados", desc: "Bodas, galas, eventos corporativos." },
    ],
  },
  recursos: {
    label: "Recursos",
    items: [
      { href: "/recursos/ayuda", title: "Centro de ayuda", desc: "Guías paso a paso y FAQ." },
      { href: "/recursos/casos", title: "Casos de éxito", desc: "Cómo otros organizadores usan Noa Events." },
      { href: "/recursos/api", title: "API y desarrolladores", desc: "Webhooks, integraciones, JSON." },
      { href: "/recursos/calculadora", title: "Calculadora de comisiones", desc: "Estima cuánto te quedas neto." },
    ],
  },
  nosotros: {
    label: "Nosotros",
    items: [
      { href: "/nosotros", title: "Sobre Noa Events", desc: "Quiénes somos, qué hacemos y por qué." },
      { href: "/nosotros/equipo", title: "Equipo", desc: "Las personas detrás del producto." },
      { href: "/nosotros/contacto", title: "Contacto", desc: "Hablamos contigo en 24h." },
      { href: "https://heynoa.es", title: "Conoce Noa", desc: "Tu asistente personal de finanzas.", external: true },
    ],
  },
} as const;

export function HeaderNav() {
  const [open, setOpen] = useState<MenuKey | null>(null);

  return (
    <div className="hidden lg:flex items-center gap-1">
      {(Object.keys(MENU) as MenuKey[]).map((key) => {
        const menu = MENU[key];
        const isOpen = open === key;
        return (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => setOpen(key)}
            onMouseLeave={() => setOpen((cur) => (cur === key ? null : cur))}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : key)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {menu.label}
              <ChevronDown
                className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50"
                >
                  <div className="w-[380px] rounded-2xl border border-border bg-card p-2 shadow-2xl">
                    <ul className="grid gap-0.5">
                      {menu.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            target={"external" in item && item.external ? "_blank" : undefined}
                            rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
                            onClick={() => setOpen(null)}
                            className="block rounded-xl p-3 hover:bg-muted transition-colors"
                          >
                            <p className="font-sans text-sm font-bold">{item.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {item.desc}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
