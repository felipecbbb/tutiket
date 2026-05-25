"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  async function handle() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado");
    } catch {
      toast.error("No se pudo copiar");
    }
  }
  return (
    <Button variant="ghost" size="sm" onClick={handle} aria-label="Copiar">
      {children}
    </Button>
  );
}
