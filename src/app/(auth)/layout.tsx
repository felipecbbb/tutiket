import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Liquid background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-liquid absolute -top-1/3 -left-1/4 size-[60vw] rounded-full bg-primary/25 blur-3xl" />
        <div className="bg-liquid absolute -bottom-1/4 -right-1/4 size-[55vw] rounded-full bg-secondary/20 blur-3xl [animation-delay:-9s]" />
      </div>

      <header className="px-6 py-5 lg:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            <span className="inline-block rotate-[-2deg] rounded-md bg-foreground px-2 py-1 text-background">
              proyecto
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Volver al inicio
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} proyecto · Hecho en Canarias
      </footer>
    </main>
  );
}
