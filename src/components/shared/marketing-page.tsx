import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

type Section = {
  title: string;
  body: string;
};

type Bullet = {
  title: string;
  body: string;
};

export function MarketingPage({
  eyebrow,
  title,
  subtitle,
  bullets,
  sections,
  cta = { href: "/registro", label: "Crear evento" },
  showCta = true,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets?: Bullet[];
  sections?: Section[];
  cta?: { href: string; label: string };
  showCta?: boolean;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · {eyebrow} ·
          </p>
          <h1 className="mt-3 font-sans text-5xl font-bold tracking-tight md:text-6xl leading-[1.05]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {subtitle}
          </p>
          {showCta && (
            <div className="mt-9">
              <Link
                href={cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-base font-medium text-background hover:opacity-90"
              >
                {cta.label}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {bullets && bullets.length > 0 && (
        <section className="px-6 py-12 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bullets.map((b) => (
                <li
                  key={b.title}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <p className="font-sans text-lg font-bold tracking-tight">{b.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sections && sections.length > 0 && (
        <section className="px-6 py-12 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-sans text-2xl font-bold tracking-tight md:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-foreground text-background p-10 text-center">
          <p className="font-sans text-2xl font-bold md:text-3xl">
            Empieza gratis. Configura tu evento en 5 minutos.
          </p>
          <Link
            href="/registro"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90"
          >
            Crear cuenta
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
