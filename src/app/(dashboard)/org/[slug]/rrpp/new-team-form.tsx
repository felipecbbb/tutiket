"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { createPrTeam } from "@/server/actions/pr";

export function NewTeamForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Nombre demasiado corto");
      return;
    }
    setSubmitting(true);
    try {
      await createPrTeam({
        organizationId,
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success("Equipo creado");
      setName("");
      setDescription("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Field label="Nombre" htmlFor="team-name" required>
        <Input
          id="team-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Equipo viernes"
        />
      </Field>
      <Field label="Descripción (opcional)" htmlFor="team-desc">
        <textarea
          id="team-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creando…" : "Crear equipo"}
      </Button>
    </form>
  );
}
