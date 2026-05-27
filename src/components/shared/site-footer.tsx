import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40 px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="full" size="md" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              La ticketera que se preocupa por tus finanzas. Vende entradas,
              gestiona tu equipo y deja que tu contabilidad se actualice sola
              en{" "}
              <a
                href="https://heynoa.es"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Noa
              </a>
              .
            </p>
          </div>
          <FooterCol
            title="Producto"
            links={[
              { href: "/soluciones/ticketing", label: "Ticketing" },
              { href: "/soluciones/contabilidad", label: "Contabilidad con Noa" },
              { href: "/eventos", label: "Tipos de evento" },
              { href: "/organizar-info", label: "Para organizadores" },
              { href: "/recursos/calculadora", label: "Calculadora" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { href: "/legal/aviso", label: "Aviso legal" },
              { href: "/legal/privacidad", label: "Privacidad" },
              { href: "/legal/cookies", label: "Cookies" },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Noa Events · Un servicio de Noa ·
            Hecho en Canarias
          </p>
          <a
            href="https://heynoa.es"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            heynoa.es
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-sans text-sm font-bold tracking-tight">{title}</p>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
