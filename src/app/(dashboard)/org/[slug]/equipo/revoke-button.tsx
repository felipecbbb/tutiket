"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { revokeInvitation } from "@/server/actions/invitations";
import { Button } from "@/components/ui/button";

export function RevokeButton({
  id,
  children,
  "aria-label": ariaLabel,
}: {
  id: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handle() {
    if (!confirm("¿Revocar invitación?")) return;
    setPending(true);
    try {
      await revokeInvitation(id);
      toast.success("Revocada");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handle}
      disabled={pending}
      aria-label={ariaLabel}
      className="size-8"
    >
      {children}
    </Button>
  );
}
