import { adminListVenues } from "@/server/actions/admin";
import { VenueRow } from "./venue-row";

export default async function AdminVenuesPage() {
  const venues = await adminListVenues();

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Locales ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Todos los locales
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{venues.length} resultados</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <Th>Nombre</Th>
              <Th>Ubicación</Th>
              <Th>Aforo</Th>
              <Th>Estado</Th>
              <Th align="right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {venues.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground">
                  Sin locales.
                </td>
              </tr>
            ) : (
              venues.map((v) => (
                <VenueRow
                  key={v.id}
                  venue={{
                    id: v.id,
                    name: v.name,
                    location: v.location,
                    capacity: v.capacity,
                    status: v.status,
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
