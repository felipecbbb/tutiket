import { adminListEvents } from "@/server/actions/admin";
import { formatDate } from "@/lib/utils";
import { EventRow } from "./event-row";

type SearchParams = Promise<{ q?: string }>;

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const events = await adminListEvents(q);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Eventos ·
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Todos los eventos
          </h1>
        </div>
        <form action="/admin/eventos" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por nombre"
            className="h-11 w-72 rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <Th>Nombre</Th>
              <Th>Fecha</Th>
              <Th>Vendidas</Th>
              <Th>Estado</Th>
              <Th align="right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground">
                  Sin eventos.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <EventRow
                  key={e.id}
                  event={{
                    id: e.id,
                    slug: e.slug,
                    name: e.name,
                    status: e.status,
                    startDate: formatDate(e.startDate, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                    capacity: e.capacity,
                    ticketsSold: e.ticketsSold,
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
