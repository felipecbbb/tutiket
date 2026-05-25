"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function handle() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <Button variant="ghost" size="sm" onClick={handle} disabled={pending}>
      <LogOut className="size-4" />
      <span className="hidden sm:inline">Salir</span>
    </Button>
  );
}
