"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteVenue } from "@/server/actions/admin";

type Props = {
  venue: {
    id: string;
    name: string;
    location: string;
    capacity: number;
    status: "active" | "inactive";
  };
};

export function VenueRow({ venue }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`¿Eliminar "${venue.name}"?`)) return;
    startTransition(async () => {
      try {
        await adminDeleteVenue(venue.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="font-medium">{venue.name}</div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{venue.location}</td>
      <td className="px-4 py-3">{venue.capacity.toLocaleString("es-ES")}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
            venue.status === "active"
              ? "bg-accent/30 text-accent-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {venue.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Eliminar"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </td>
    </tr>
  );
}
