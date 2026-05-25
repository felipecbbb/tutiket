"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCoupon, updateCoupon } from "@/server/actions/coupons";

type Props = {
  coupon: {
    id: string;
    code: string;
    discountLabel: string;
    uses: number;
    maxUses: number;
    status: "active" | "inactive";
    window: string;
    eventName: string | null;
  };
};

export function CouponRow({ coupon }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(coupon.status);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = status === "active" ? "inactive" : "active";
    setStatus(next);
    startTransition(async () => {
      try {
        await updateCoupon(coupon.id, { status: next });
        toast.success(next === "active" ? "Cupón activado" : "Cupón pausado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
        setStatus(coupon.status);
      }
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar cupón ${coupon.code}?`)) return;
    startTransition(async () => {
      try {
        await deleteCoupon(coupon.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  const exhausted = coupon.uses >= coupon.maxUses;

  return (
    <li className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold uppercase">{coupon.code}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                status === "active"
                  ? "bg-accent/30 text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </span>
            {exhausted && (
              <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-medium uppercase text-destructive">
                agotado
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm">
            <b>{coupon.discountLabel}</b>
            <span className="text-muted-foreground">
              {" "}
              · {coupon.uses}/{coupon.maxUses} usados · {coupon.window}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {coupon.eventName ? `Solo ${coupon.eventName}` : "Toda la org"}
          </p>
        </div>
        <div className="inline-flex gap-1">
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            aria-label={status === "active" ? "Pausar" : "Activar"}
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
