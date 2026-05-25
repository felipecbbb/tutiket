"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import {
  createOrganizationSchema,
  orgSectorValues,
  type CreateOrganizationInput,
} from "@/lib/validations/organization";
import { createOrganization } from "@/server/actions/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";

type FormInput = z.input<typeof createOrganizationSchema>;

const SECTOR_LABELS: Record<(typeof orgSectorValues)[number], string> = {
  restaurante: "Restaurante",
  discoteca: "Discoteca",
  pub: "Pub",
  beach_club: "Beach club",
  festival: "Festival",
  promotora: "Promotora",
  lounge: "Lounge",
};

export function NewOrgButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      sector: "discoteca",
      description: "",
      location: "",
      capacity: undefined,
      openingHours: "",
    },
  });

  async function onSubmit(values: CreateOrganizationInput) {
    setSubmitting(true);
    try {
      const created = await createOrganization(values);
      toast.success("Organización creada");
      reset();
      setOpen(false);
      router.push(`/org/${created.slug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nueva organización
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Nueva organización"
        description="Empieza con lo esencial. Podrás completar el resto más tarde."
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Nombre" htmlFor="name" error={errors.name?.message} required>
            <Input id="name" {...register("name")} placeholder="Sala Berlín" />
          </Field>

          <Field label="Tipo" htmlFor="sector" error={errors.sector?.message} required>
            <select
              id="sector"
              {...register("sector")}
              className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {orgSectorValues.map((s) => (
                <option key={s} value={s}>
                  {SECTOR_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ubicación" htmlFor="location" error={errors.location?.message}>
              <Input
                id="location"
                {...register("location")}
                placeholder="Las Palmas de GC"
              />
            </Field>
            <Field label="Aforo (opcional)" htmlFor="capacity" error={errors.capacity?.message}>
              <Input id="capacity" type="number" {...register("capacity")} placeholder="350" />
            </Field>
          </div>

          <Field label="Descripción" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creando…" : "Crear"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
