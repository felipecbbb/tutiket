import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { getCurrentUser } from "@/server/auth";
import { HeaderNav } from "./header-nav";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5 lg:px-12">
        <Link
          href="/"
          aria-label="Noa Events"
          className="shrink-0 hover:opacity-80 transition-opacity"
        >
          <Logo variant="full" size="md" />
        </Link>

        <HeaderNav />

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link
                href="/mi"
                className="hidden sm:inline text-sm font-medium hover:text-foreground/70"
              >
                Mi cuenta
              </Link>
              <Link
                href="/org"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Mi panel
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline text-sm font-medium underline underline-offset-4 hover:text-foreground/70"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Crear evento
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
