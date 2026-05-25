import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { getCurrentUser } from "@/server/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="px-6 py-5 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" aria-label="Noa Events" className="hover:opacity-80 transition-opacity">
          <Logo variant="full" size="md" />
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
                <Link href="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
