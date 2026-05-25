import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

type Bullet = { title: string; body: string };
type Section = { title: string; body: string };

type Theme = "coral" | "mint" | "yellow" | "lila" | "sky" | "rose" | "sand";

const THEMES: Record<Theme, { bg: string; ink: string; gradient: string }> = {
  coral: { bg: "#FFD7C7", ink: "#FF6B5B", gradient: "from-[#FFD7C7] to-[#FFE9A8]" },
  mint: { bg: "#D8F3DC", ink: "#1B7E5E", gradient: "from-[#D8F3DC] to-[#CFE2FF]" },
  yellow: { bg: "#FFE9A8", ink: "#B58900", gradient: "from-[#FFE9A8] to-[#FFD7C7]" },
  lila: { bg: "#E5D9F2", ink: "#6D28D9", gradient: "from-[#E5D9F2] to-[#FFD7E1]" },
  sky: { bg: "#CFE2FF", ink: "#1B5EBA", gradient: "from-[#CFE2FF] to-[#D8F3DC]" },
  rose: { bg: "#FFD7E1", ink: "#C2185B", gradient: "from-[#FFD7E1] to-[#E5D9F2]" },
  sand: { bg: "#FCE4B6", ink: "#8B6F12", gradient: "from-[#FCE4B6] to-[#FFD7C7]" },
};

export function MarketingPage({
  eyebrow,
  title,
  highlight,
  subtitle,
  bullets,
  sections,
  cta = { href: "/registro", label: "Crear evento" },
  showCta = true,
  theme = "coral",
  visual,
}: {
  eyebrow: string;
  /** Título principal. Puedes pasar JSX o texto. */
  title: string;
  /** Palabra(s) que se subrayan con squiggle dentro del título. */
  highlight?: string;
  subtitle: string;
  bullets?: Bullet[];
  sections?: Section[];
  cta?: { href: string; label: string };
  showCta?: boolean;
  theme?: Theme;
  /** SVG visual ilustrativo en la columna derecha del hero. */
  visual?: React.ReactNode;
}) {
  const t = THEMES[theme];

  // Si hay highlight, lo wrappeamos con SVG squiggle.
  const renderTitle = () => {
    if (!highlight) return title;
    const idx = title.indexOf(highlight);
    if (idx < 0) return title;
    return (
      <>
        {title.slice(0, idx)}
        <span className="relative inline-block">
          {highlight}
          <svg
            aria-hidden
            viewBox="0 0 220 12"
            preserveAspectRatio="none"
            className="absolute -bottom-1 left-0 w-full h-3"
            style={{ color: t.ink }}
          >
            <path
              d="M2 9 Q 30 1, 60 6 T 120 6 T 180 6 T 218 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
        {title.slice(idx + highlight.length)}
      </>
    );
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 py-20 lg:px-12 lg:py-24">
        <div
          className={`pointer-events-none absolute -top-32 -right-32 size-[480px] rounded-full bg-gradient-to-br ${t.gradient} blur-3xl opacity-70`}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: t.bg, color: t.ink }}
              >
                · {eyebrow} ·
              </span>
              <h1 className="mt-5 font-sans text-5xl font-bold tracking-[-0.02em] md:text-6xl lg:text-7xl leading-[1.02]">
                {renderTitle()}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                {subtitle}
              </p>
              {showCta && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={cta.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
                  >
                    {cta.label}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <Link
                    href="/recursos/calculadora"
                    className="rounded-full border border-foreground/15 bg-background/80 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-muted"
                  >
                    Calcular ingresos
                  </Link>
                </div>
              )}
            </div>
            {visual && <div className="relative">{visual}</div>}
          </div>
        </div>
      </section>

      {bullets && bullets.length > 0 && (
        <section className="px-6 py-16 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bullets.map((b, i) => (
                <li
                  key={b.title}
                  className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-lg"
                  style={{
                    background:
                      i % 5 === 0
                        ? `linear-gradient(135deg, ${t.bg}40 0%, transparent 100%)`
                        : undefined,
                  }}
                >
                  <span
                    className="inline-flex size-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: t.bg, color: t.ink }}
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <p className="mt-4 font-sans text-lg font-bold tracking-tight">
                    {b.title}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {b.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {sections && sections.length > 0 && (
        <section className="px-6 py-12 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-12">
            {sections.map((s, i) => (
              <div
                key={s.title}
                className="relative pl-6 border-l-4"
                style={{ borderColor: t.ink }}
              >
                <span
                  className="absolute -left-3 top-0 grid size-6 place-items-center rounded-full text-[10px] font-bold text-background"
                  style={{ backgroundColor: t.ink }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-sans text-2xl font-bold tracking-[-0.01em] md:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 py-20 lg:px-12">
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-foreground p-10 text-background text-center"
        >
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-[280px] rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: t.ink }}
          />
          <p className="font-sans text-3xl font-bold tracking-[-0.01em] md:text-4xl">
            5 minutos. Sin contrato.
          </p>
          <p className="mt-3 text-background/70">
            Cobras la primera entrada antes de terminar el café.
          </p>
          <Link
            href="/registro"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90"
          >
            Crear evento gratis
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
