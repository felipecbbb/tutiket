import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col bg-background">
      <header className="px-6 py-5 lg:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" aria-label="Noa Events">
            <Logo variant="full" size="md" />
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
        © {new Date().getFullYear()} Noa Events · Un servicio de Noa
      </footer>
    </main>
  );
}
