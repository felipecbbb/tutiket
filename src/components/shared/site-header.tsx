import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/server/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="px-6 py-5 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          <span className="inline-block rotate-[-2deg] rounded-md bg-foreground px-2 py-1 text-background">
            proyecto
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/eventos" className="text-sm font-medium hover:text-primary">
            Eventos
          </Link>
          <Link href="/venues" className="text-sm font-medium hover:text-primary">
            Locales
          </Link>
          <Link href="/organizar" className="text-sm font-medium hover:text-primary">
            Organizar
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mi">Mi cuenta</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/org">Mi panel</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/registro">Registrarme</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
