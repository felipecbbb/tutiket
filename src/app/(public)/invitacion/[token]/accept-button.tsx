"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/server/actions/invitations";

export function AcceptInvitationButton({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handle() {
    setSubmitting(true);
    try {
      const redirectTo = await acceptInvitation(token);
      toast.success("Invitación aceptada");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
      setSubmitting(false);
    }
  }

  return (
    <Button onClick={handle} size="lg" className="w-full" disabled={submitting}>
      {submitting ? "Aceptando…" : "Aceptar invitación"}
    </Button>
  );
}
