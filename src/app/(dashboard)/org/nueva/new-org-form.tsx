"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import {
  createOrganizationSchema,
  orgSectorValues,
  type CreateOrganizationInput,
} from "@/lib/validations/organization";

type FormInput = z.input<typeof createOrganizationSchema>;
import { createOrganization } from "@/server/actions/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

const sectorLabels: Record<(typeof orgSectorValues)[number], string> = {
  restaurante: "Restaurante",
  discoteca: "Discoteca",
  pub: "Pub",
  beach_club: "Beach club",
  festival: "Festival",
  promotora: "Promotora",
  lounge: "Lounge",
};

export function NewOrgForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
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
      router.push(`/org/${created.slug}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
              {sectorLabels[s]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Ubicación" htmlFor="location" error={errors.location?.message}>
        <Input
          id="location"
          {...register("location")}
          placeholder="Las Palmas de GC, España"
        />
      </Field>

      <Field
        label="Aforo (opcional)"
        htmlFor="capacity"
        error={errors.capacity?.message}
      >
        <Input
          id="capacity"
          type="number"
          inputMode="numeric"
          {...register("capacity")}
          placeholder="350"
        />
      </Field>

      <Field
        label="Descripción"
        htmlFor="description"
        error={errors.description?.message}
      >
        <textarea
          id="description"
          {...register("description")}
          placeholder="Una sala de música electrónica en el centro…"
          rows={3}
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creando…" : "Crear organización"}
      </Button>
    </form>
  );
}
