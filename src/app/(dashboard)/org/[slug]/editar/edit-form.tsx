"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import {
  updateOrganizationSchema,
  orgSectorValues,
  type UpdateOrganizationInput,
} from "@/lib/validations/organization";
import { updateOrganization } from "@/server/actions/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

type FormInput = z.input<typeof updateOrganizationSchema>;

const SECTOR_LABELS: Record<(typeof orgSectorValues)[number], string> = {
  restaurante: "Restaurante",
  discoteca: "Discoteca",
  pub: "Pub",
  beach_club: "Beach club",
  festival: "Festival",
  promotora: "Promotora",
  lounge: "Lounge",
};

type InitialValues = {
  name: string;
  sector: (typeof orgSectorValues)[number];
  description: string;
  location: string;
  capacity?: number;
  openingHours: string;
  logoUrl: string;
  coverUrl: string;
};

export function EditOrgForm({
  orgId,
  slug,
  initial,
}: {
  orgId: string;
  slug: string;
  initial: InitialValues;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: initial,
  });

  async function onSubmit(values: UpdateOrganizationInput) {
    setSubmitting(true);
    try {
      await updateOrganization(orgId, values);
      toast.success("Cambios guardados");
      router.push(`/org/${slug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Nombre" htmlFor="name" error={errors.name?.message} required>
        <Input id="name" {...register("name")} />
      </Field>

      <Field label="Tipo" htmlFor="sector" error={errors.sector?.message}>
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

      <Field label="Descripción" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ubicación" htmlFor="location" error={errors.location?.message}>
          <Input id="location" {...register("location")} />
        </Field>
        <Field label="Aforo" htmlFor="capacity" error={errors.capacity?.message}>
          <Input
            id="capacity"
            type="number"
            inputMode="numeric"
            {...register("capacity")}
          />
        </Field>
      </div>

      <Field
        label="Horario apertura"
        htmlFor="openingHours"
        error={errors.openingHours?.message}
      >
        <Input id="openingHours" {...register("openingHours")} placeholder="Vie-Sab 23h-6h" />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="URL logo" htmlFor="logoUrl" error={errors.logoUrl?.message}>
          <Input id="logoUrl" type="url" {...register("logoUrl")} />
        </Field>
        <Field label="URL portada" htmlFor="coverUrl" error={errors.coverUrl?.message}>
          <Input id="coverUrl" type="url" {...register("coverUrl")} />
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
