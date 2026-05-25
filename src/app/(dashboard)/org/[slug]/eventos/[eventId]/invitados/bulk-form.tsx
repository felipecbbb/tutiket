"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addGuests } from "@/server/actions/guests";
import { parseBulkGuestText } from "@/lib/validations/guest";

export function BulkGuestForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rows = parseBulkGuestText(text);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rows.length === 0) {
      toast.error("Pega al menos un invitado");
      return;
    }
    setSubmitting(true);
    try {
      const { count } = await addGuests({ eventId, rows });
      toast.success(`${count} invitados añadidos`);
      setText("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder={`María García, maria@ejemplo.com, si\nJuan Pérez, juan@ejemplo.com\nAna López`}
        className="rounded-lg border border-border bg-card p-3 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="text-xs text-muted-foreground">
        Formato: <code>nombre, email, prepaid</code> · separador coma / tab /
        punto-y-coma · prepaid acepta sí/no/1/0
      </p>

      {rows.length > 0 && (
        <p className="text-xs text-primary">
          Detectados {rows.length} {rows.length === 1 ? "invitado" : "invitados"}.
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting || rows.length === 0}>
        {submitting ? "Añadiendo…" : `Añadir ${rows.length || ""}`.trim()}
      </Button>
    </form>
  );
}
