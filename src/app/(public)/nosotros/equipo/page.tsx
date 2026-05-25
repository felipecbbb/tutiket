import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export const metadata: Metadata = { title: "Equipo" };

const TEAM = [
  {
    name: "Felipe Cámara",
    role: "Fundador",
    bio: "Producto, diseño y desarrollo. Cree que la contabilidad debería ser invisible.",
    location: "Las Palmas de GC",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Equipo ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-6xl">
            Quién hace Noa Events.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Equipo pequeño, foco grande. Construimos en Canarias.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
          {TEAM.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-foreground text-background font-bold text-lg">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <p className="font-sans font-bold tracking-tight">{p.name}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {p.role}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{p.bio}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {p.location}
              </p>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-border p-6 flex flex-col justify-center items-center text-center bg-card/40">
            <p className="font-sans font-bold tracking-tight">¿Te apuntas?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buscamos gente apasionada por producto, diseño y eventos.
            </p>
            <a
              href="mailto:hola@noaevents.app"
              className="mt-3 text-xs font-medium underline underline-offset-4"
            >
              hola@noaevents.app
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
