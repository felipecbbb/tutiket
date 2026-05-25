"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, EyeOff, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cancelEvent, publishEvent, updateEvent } from "@/server/actions/events";

type Status = "draft" | "pending" | "active" | "inactive" | "cancelled";

export function EventStatusButtons({
  eventId,
  currentStatus,
}: {
  eventId: string;
  currentStatus: Status;
  eventSlug: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(label: string, fn: () => Promise<unknown>) {
    startTransition(async () => {
      try {
        await fn();
        toast.success(label);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <div className="inline-flex flex-wrap gap-2">
      {currentStatus !== "active" && currentStatus !== "cancelled" && (
        <Button
          size="sm"
          onClick={() => run("Evento publicado", () => publishEvent(eventId))}
          disabled={pending}
        >
          <CheckCircle2 className="size-4" />
          Publicar
        </Button>
      )}
      {currentStatus === "active" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            run("Despublicado", () => updateEvent(eventId, { status: "inactive" }))
          }
          disabled={pending}
        >
          <EyeOff className="size-4" />
          Despublicar
        </Button>
      )}
      {currentStatus !== "cancelled" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!confirm("¿Cancelar el evento? Esto avisa a compradores."))
              return;
            run("Evento cancelado", () => cancelEvent(eventId));
          }}
          disabled={pending}
          className="text-destructive hover:text-destructive"
        >
          <XCircle className="size-4" />
          Cancelar
        </Button>
      )}
    </div>
  );
}
