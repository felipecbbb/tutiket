import Link from "next/link";
import { Calendar, Copy, Link2, TrendingUp } from "lucide-react";
import {
  getMyPrMember,
  getPrMemberStats,
  listMyPrEvents,
} from "@/server/actions/pr";
import { formatDate, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";

export const dynamic = "force-dynamic";

export default async function PrDashboardPage() {
  const member = await getMyPrMember();

  if (!member) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Aún no eres RR.PP.</CardTitle>
            <CardDescription>
              Cuando una organización te invite como RR.PP. desde su panel de
              Equipo, aparecerás aquí con tus eventos y comisiones.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const [stats, mine] = await Promise.all([
    getPrMemberStats(member.id),
    listMyPrEvents(),
  ]);

  const events = "events" in mine ? mine.events : [];
  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_APP_URL ?? "https://tutiket.vercel.app"
      : window.location.origin;
  const affiliateLink = member.code
    ? `${baseUrl}/eventos?pr=${member.code}`
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Panel RR.PP. ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Hola, {member.name.split(" ")[0] ?? member.name}
      </h1>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Tile label="Tickets vendidos" value={stats.qty.toLocaleString("es-ES")} />
        <Tile label="Facturación" value={formatPrice(stats.gross)} />
        <Tile label="Comisión ganada" value={formatPrice(stats.commission)} accent />
      </div>

      {/* Link afiliado */}
      {affiliateLink && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="size-4" />
              Tu link de afiliado
            </CardTitle>
            <CardDescription>
              Compártelo. Cada compra que entre con tu código te suma comisión
              ({(member.commissionBps / 100).toFixed(1)}%).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <span className="font-mono text-sm truncate flex-1">{affiliateLink}</span>
              <CopyButton text={affiliateLink}>
                <Copy className="size-4" />
              </CopyButton>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Código: <span className="font-mono font-bold">{member.code}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Eventos asignados */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="size-5" />
          Tus eventos asignados
        </h2>
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            Aún no estás asignado a eventos. Pide al organizador que te asigne.
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {events.map((evt) => (
              <li key={evt.id}>
                <Link
                  href={`/eventos/${evt.slug}`}
                  target="_blank"
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60"
                >
                  <p className="font-display text-lg font-bold group-hover:text-primary">
                    {evt.name}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {formatDate(evt.startDate, {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {evt.ticketsSold}/{evt.capacity} vendidas
                    {evt.commissionBps !== null && (
                      <>
                        {" "}· Tu comisión:{" "}
                        <b className="text-foreground">
                          {(evt.commissionBps / 100).toFixed(1)}%
                        </b>
                      </>
                    )}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
    >
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
