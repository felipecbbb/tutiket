"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { createVenueSchema, type CreateVenueInput } from "@/lib/validations/venue";
import { createVenue } from "@/server/actions/venues";

type FormInput = z.input<typeof createVenueSchema>;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

export function NewVenueForm({
  organizationId,
  orgSlug,
}: {
  organizationId: string;
  orgSlug: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, CreateVenueInput>({
    resolver: zodResolver(createVenueSchema),
    defaultValues: {
      organizationId,
      name: "",
      location: "",
      capacity: 100,
      isPublic: true,
      isPrimary: false,
    },
  });

  async function onSubmit(values: CreateVenueInput) {
    setSubmitting(true);
    try {
      await createVenue(values);
      toast.success("Local creado");
      router.push(`/org/${orgSlug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("organizationId")} value={organizationId} />

      <Field label="Nombre" htmlFor="name" error={errors.name?.message} required>
        <Input id="name" {...register("name")} placeholder="Sala Principal" />
      </Field>

      <Field
        label="Ubicación"
        htmlFor="location"
        error={errors.location?.message}
        required
      >
        <Input id="location" {...register("location")} placeholder="C/ Triana 51, LPGC" />
      </Field>

      <Field label="Aforo" htmlFor="capacity" error={errors.capacity?.message} required>
        <Input id="capacity" type="number" inputMode="numeric" {...register("capacity")} />
      </Field>

      <Field
        label="Descripción"
        htmlFor="description"
        error={errors.description?.message}
      >
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isPrimary")} />
        Hacer principal
      </label>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creando…" : "Crear local"}
      </Button>
    </form>
  );
}
