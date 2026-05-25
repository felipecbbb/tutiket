import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { events } from "@/db/schema";
import {
  eventValidationStats,
  listEventValidations,
} from "@/server/actions/validations";
import { formatDate } from "@/lib/utils";
import { Scanner } from "./scanner";

export const dynamic = "force-dynamic";

type Params = Promise<{ eventId: string }>;

export default async function ValidateEventPage({ params }: { params: Params }) {
  const { eventId } = await params;

  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!event || event.deletedAt) notFound();

  // El server action hace su propio role-check; si falla, lanza
  const [stats, recent] = await Promise.all([
    eventValidationStats(eventId),
    listEventValidations(eventId),
  ]);

  const ok = stats.ok ?? 0;
  const duplicate = stats.duplicate ?? 0;
  const invalid = (stats.invalid ?? 0) + (stats.wrong_event ?? 0) + (stats.cancelled ?? 0);
  const total = ok + duplicate + invalid;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/validar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" />
        Volver a eventos
      </Link>

      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Validador ·
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
        {event.name}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatDate(event.startDate, {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Tile label="Válidas" value={ok} accent="ok" />
        <Tile label="Duplicadas" value={duplicate} accent="warn" />
        <Tile label="Inválidas" value={invalid} accent="bad" />
      </div>

      <div className="mt-6">
        <Scanner eventId={eventId} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold mb-3">Últimas 50 validaciones</h2>
        {recent.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
            Sin validaciones aún en este evento.
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {recent.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    v.result === "ok"
                      ? "bg-accent/30 text-accent-foreground"
                      : v.result === "duplicate"
                        ? "bg-primary/20 text-primary"
                        : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {v.result}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {v.ticketId.slice(0, 8)}…
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(v.validatedAt, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Total acumulado: {total} escaneos · capacidad evento {event.capacity}
      </p>
    </div>
  );
}

function Tile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "ok" | "warn" | "bad";
}) {
  const color =
    accent === "ok"
      ? "border-accent/40 bg-accent/10"
      : accent === "warn"
        ? "border-primary/40 bg-primary/10"
        : "border-destructive/30 bg-destructive/5";
  return (
    <div className={`rounded-xl border ${color} p-4`}>
      <p className="font-display text-3xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
