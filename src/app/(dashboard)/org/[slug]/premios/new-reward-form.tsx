"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { createReward } from "@/server/actions/loyalty";

export function NewRewardForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [costPoints, setCostPoints] = useState(100);
  const [stock, setStock] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Nombre demasiado corto");
      return;
    }
    if (costPoints < 1) {
      toast.error("Coste debe ser positivo");
      return;
    }
    setSubmitting(true);
    try {
      await createReward({
        organizationId,
        name: name.trim(),
        description: description.trim() || undefined,
        costPoints,
        stock: stock === "" ? null : stock,
      });
      toast.success("Premio creado");
      setName("");
      setDescription("");
      setCostPoints(100);
      setStock("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field label="Nombre" htmlFor="r-name" required>
        <Input
          id="r-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Copa gratis en barra"
        />
      </Field>
      <Field label="Descripción" htmlFor="r-desc">
        <textarea
          id="r-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Coste (puntos)" htmlFor="r-cost" required>
          <Input
            id="r-cost"
            type="number"
            min={1}
            value={costPoints}
            onChange={(e) => setCostPoints(parseInt(e.target.value) || 0)}
          />
        </Field>
        <Field label="Stock (opcional)" htmlFor="r-stock" hint="Vacío = ilimitado">
          <Input
            id="r-stock"
            type="number"
            min={1}
            value={stock}
            onChange={(e) => {
              const v = e.target.value;
              setStock(v === "" ? "" : parseInt(v) || 0);
            }}
          />
        </Field>
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creando…" : "Crear premio"}
      </Button>
    </form>
  );
}
