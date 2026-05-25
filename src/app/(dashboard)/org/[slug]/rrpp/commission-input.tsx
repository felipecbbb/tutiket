"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setPrMemberCommission } from "@/server/actions/pr";

/** Comisión editable inline. Guardamos como porcentaje (UX) y convertimos a bps. */
export function CommissionInput({
  memberId,
  initialBps,
}: {
  memberId: string;
  initialBps: number;
}) {
  const router = useRouter();
  const [pct, setPct] = useState(initialBps / 100);
  const [pending, startTransition] = useTransition();

  function save() {
    const bps = Math.round(pct * 100);
    if (bps === initialBps) return;
    startTransition(async () => {
      try {
        await setPrMemberCommission(memberId, bps);
        toast.success(`Comisión → ${pct}%`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
        setPct(initialBps / 100);
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-1">
      <input
        type="number"
        step="0.5"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => setPct(parseFloat(e.target.value) || 0)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        disabled={pending}
        className="h-8 w-16 rounded-md border border-border bg-background px-2 text-right text-sm tabular-nums focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <span className="text-muted-foreground">%</span>
    </div>
  );
}
