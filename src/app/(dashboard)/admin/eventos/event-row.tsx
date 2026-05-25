"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  adminDeleteEvent,
  adminUpdateEventStatus,
} from "@/server/actions/admin";

type EventStatus = "draft" | "pending" | "active" | "inactive" | "cancelled";
const STATUSES: EventStatus[] = [
  "draft",
  "pending",
  "active",
  "inactive",
  "cancelled",
];

type Props = {
  event: {
    id: string;
    slug: string;
    name: string;
    status: EventStatus;
    startDate: string;
    capacity: number;
    ticketsSold: number;
  };
};

export function EventRow({ event }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [pending, startTransition] = useTransition();

  function change(next: EventStatus) {
    setStatus(next);
    startTransition(async () => {
      try {
        await adminUpdateEventStatus(event.id, next);
        toast.success(`Estado → ${next}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
        setStatus(event.status);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar "${event.name}"?`)) return;
    startTransition(async () => {
      try {
        await adminDeleteEvent(event.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  const ratio =
    event.capacity > 0 ? Math.round((event.ticketsSold / event.capacity) * 100) : 0;

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="font-medium">{event.name}</div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{event.startDate}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {event.ticketsSold}/{event.capacity}
          </span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, ratio)}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <select
          value={status}
          disabled={pending}
          onChange={(e) => change(e.target.value as EventStatus)}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex gap-1">
          <Link
            href={`/eventos/${event.slug}`}
            target="_blank"
            aria-label="Ver evento"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Eye className="size-4" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            aria-label="Eliminar"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
