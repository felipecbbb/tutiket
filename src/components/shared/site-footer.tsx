import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} proyecto · Hecho en Canarias
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link href="/legal/aviso" className="hover:text-foreground">
            Aviso legal
          </Link>
          <Link href="/legal/privacidad" className="hover:text-foreground">
            Privacidad
          </Link>
          <Link href="/legal/cookies" className="hover:text-foreground">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
