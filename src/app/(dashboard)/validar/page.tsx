import Link from "next/link";
import { Calendar, MapPin, ScanLine } from "lucide-react";
import { listValidatorEvents } from "@/server/actions/validations";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ValidatorIndexPage() {
  const events = await listValidatorEvents();

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Validador ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Tus eventos
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Selecciona un evento para abrir el scanner. Apunta la cámara al QR del
        asistente y la entrada se valida en tiempo real.
      </p>

      {events.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <ScanLine className="size-6 text-muted-foreground" />
          <p className="font-display text-2xl font-bold">
            No tienes eventos asignados
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Pide al organizador que te invite como validador, o que te asigne a
            un evento concreto.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {events.map((evt) => (
            <li key={evt.id}>
              <Link
                href={`/validar/${evt.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                      evt.status === "active"
                        ? "bg-accent/30 text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
                <p className="font-display text-xl font-bold group-hover:text-primary">
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
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                  <MapPin className="size-3.5" />
                  {evt.location}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary">
                  <ScanLine className="size-3.5" />
                  Abrir scanner
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
