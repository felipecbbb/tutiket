"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { redeemReward } from "@/server/actions/loyalty";

export function RedeemButton({
  rewardId,
  disabled,
  label,
}: {
  rewardId: string;
  disabled: boolean;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handle() {
    if (!confirm("¿Canjear este premio?")) return;
    startTransition(async () => {
      try {
        await redeemReward(rewardId);
        toast.success("¡Premio canjeado!");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <Button onClick={handle} disabled={disabled || pending} size="sm">
      {pending ? "Canjeando…" : label}
    </Button>
  );
}
