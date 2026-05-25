"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/server/actions/notifications";

export function MarkAllReadButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handle() {
    startTransition(async () => {
      try {
        await markAllNotificationsRead();
        toast.success(`${count} marcadas como leídas`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handle} disabled={pending}>
      <CheckCheck className="size-4" />
      Marcar todas
    </Button>
  );
}
