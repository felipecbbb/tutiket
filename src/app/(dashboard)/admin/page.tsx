import { Building2, CalendarCheck, Ticket, TrendingUp, Users } from "lucide-react";
import { adminPlatformStats } from "@/server/actions/admin";
import { formatPrice } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const stats = await adminPlatformStats();

  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Super-admin ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Resumen de la plataforma
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile icon={<Users />} label="Usuarios" value={stats.users.toLocaleString("es-ES")} />
        <StatTile
          icon={<Building2 />}
          label="Organizaciones"
          value={stats.organizations.toLocaleString("es-ES")}
        />
        <StatTile
          icon={<CalendarCheck />}
          label="Eventos"
          value={stats.events.toLocaleString("es-ES")}
        />
        <StatTile
          icon={<Ticket />}
          label="Entradas vendidas"
          value={stats.ticketsSold.toLocaleString("es-ES")}
        />
        <StatTile
          icon={<TrendingUp />}
          label="Ingresos totales"
          value={formatPrice(stats.revenueCents)}
        />
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl font-bold mb-1">Acciones rápidas</h2>
        <p className="text-sm text-muted-foreground">
          Usa las pestañas de arriba para gestionar cada recurso.
        </p>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
