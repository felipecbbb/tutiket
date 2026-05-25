import { adminListOrganizations } from "@/server/actions/admin";
import { formatDate } from "@/lib/utils";
import { OrgRow } from "./org-row";

export default async function AdminOrgsPage() {
  const orgs = await adminListOrganizations();

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Organizaciones ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Todas las organizaciones
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{orgs.length} resultados</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <Th>Nombre</Th>
              <Th>Sector</Th>
              <Th>Ubicación</Th>
              <Th>Estado</Th>
              <Th>Alta</Th>
              <Th align="right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {orgs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground">
                  Sin organizaciones.
                </td>
              </tr>
            ) : (
              orgs.map((o) => (
                <OrgRow
                  key={o.id}
                  org={{
                    id: o.id,
                    name: o.name,
                    slug: o.slug,
                    sector: o.sector,
                    location: o.location ?? "—",
                    status: o.status,
                    createdAt: formatDate(o.createdAt, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={`px-4 py-3 ${align === "right" ? "text-right" : "text-left"} font-medium`}
    >
      {children}
    </th>
  );
}
