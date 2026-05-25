"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteReward, toggleReward } from "@/server/actions/loyalty";

type Props = {
  reward: {
    id: string;
    name: string;
    description: string | null;
    costPoints: number;
    stock: number | null;
    redeemed: number;
    status: "active" | "inactive";
  };
};

export function RewardRow({ reward }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleReward(reward.id);
        toast.success(reward.status === "active" ? "Premio pausado" : "Premio activado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar premio "${reward.name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteReward(reward.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  const exhausted = reward.stock !== null && reward.redeemed >= reward.stock;

  return (
    <li className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{reward.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                reward.status === "active"
                  ? "bg-accent/30 text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {reward.status}
            </span>
            {exhausted && (
              <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-medium uppercase text-destructive">
                agotado
              </span>
            )}
          </div>
          {reward.description && (
            <p className="text-xs text-muted-foreground">{reward.description}</p>
          )}
          <p className="mt-1 text-sm">
            <b className="text-primary">{reward.costPoints}</b> puntos
            <span className="text-muted-foreground">
              {" "}
              · {reward.redeemed} canjeados
              {reward.stock !== null && ` / ${reward.stock} stock`}
            </span>
          </p>
        </div>
        <div className="inline-flex gap-1 shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            disabled={pending}
            aria-label="Pausar / activar"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <Power className="size-4" />
          </button>
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
      </div>
    </li>
  );
}
