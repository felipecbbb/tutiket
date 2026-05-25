"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeGuest } from "@/server/actions/guests";

type Props = {
  guest: {
    id: string;
    name: string;
    email: string | null;
    prepaid: boolean;
  };
};

export function GuestRow({ guest }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`¿Quitar a ${guest.name}?`)) return;
    startTransition(async () => {
      try {
        await removeGuest(guest.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-3 py-2 font-medium">{guest.name}</td>
      <td className="px-3 py-2 text-muted-foreground">{guest.email ?? "—"}</td>
      <td className="px-3 py-2">
        {guest.prepaid ? (
          <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-medium uppercase text-accent-foreground">
            Prepagado
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
            Invitación
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-right">
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
