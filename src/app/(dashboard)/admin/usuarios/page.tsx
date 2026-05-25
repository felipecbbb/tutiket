import { adminListUsers } from "@/server/actions/admin";
import { formatDate } from "@/lib/utils";
import { UserRow } from "./user-row";

type SearchParams = Promise<{ q?: string }>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const users = await adminListUsers(q);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            · Usuarios ·
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Gestión de usuarios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {users.length} resultados (máx 100)
          </p>
        </div>
        <form action="/admin/usuarios" className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por email o nombre"
            className="h-11 w-72 rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <Th>Usuario</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>Alta</Th>
              <Th align="right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-foreground">
                  Sin resultados.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UserRow
                  key={u.id}
                  user={{
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    createdAt: formatDate(u.createdAt, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                    emailVerified: u.emailVerified,
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
