"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { createEventSchema, type CreateEventInput } from "@/lib/validations/event";
import { createEvent } from "@/server/actions/events";

type FormInput = z.input<typeof createEventSchema>;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

type Props = {
  organizationId: string;
  orgSlug: string;
  venues: { id: string; name: string }[];
};

export function NewEventForm({ organizationId, orgSlug, venues }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      organizationId,
      name: "",
      location: "",
      category: "",
      capacity: 100,
      isPublic: true,
    },
  });

  async function onSubmit(values: CreateEventInput) {
    setSubmitting(true);
    try {
      const created = await createEvent(values);
      toast.success("Evento creado como borrador");
      router.push(`/org/${orgSlug}`);
      router.refresh();
      void created;
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
        <Input id="name" {...register("name")} placeholder="Lights Off — Noche techno" />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Categoría" htmlFor="category" error={errors.category?.message} required>
          <Input id="category" {...register("category")} placeholder="techno · house · live" />
        </Field>
        <Field label="Aforo" htmlFor="capacity" error={errors.capacity?.message} required>
          <Input id="capacity" type="number" inputMode="numeric" {...register("capacity")} />
        </Field>
      </div>

      <Field label="Ubicación" htmlFor="location" error={errors.location?.message} required>
        <Input id="location" {...register("location")} placeholder="C/ Triana 51, Las Palmas" />
      </Field>

      {venues.length > 0 && (
        <Field label="Local" htmlFor="venueId" hint="Opcional" error={errors.venueId?.message}>
          <select
            id="venueId"
            {...register("venueId")}
            className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">— Sin local asignado —</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Inicio"
          htmlFor="startDate"
          error={errors.startDate?.message}
          required
        >
          <Input id="startDate" type="datetime-local" {...register("startDate")} />
        </Field>
        <Field label="Fin" htmlFor="endDate" error={errors.endDate?.message} required>
          <Input id="endDate" type="datetime-local" {...register("endDate")} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Apertura puertas"
          htmlFor="doorOpeningTime"
          hint="HH:MM (opcional)"
          error={errors.doorOpeningTime?.message}
        >
          <Input
            id="doorOpeningTime"
            type="time"
            {...register("doorOpeningTime")}
          />
        </Field>
        <Field
          label="Edad mínima"
          htmlFor="minimumAge"
          hint="Opcional"
          error={errors.minimumAge?.message}
        >
          <Input
            id="minimumAge"
            type="number"
            inputMode="numeric"
            {...register("minimumAge")}
            placeholder="18"
          />
        </Field>
      </div>

      <Field label="Descripción" htmlFor="description" error={errors.description?.message}>
        <textarea
          id="description"
          {...register("description")}
          rows={5}
          placeholder="Qué se va a vivir esa noche…"
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creando…" : "Crear evento"}
      </Button>
    </form>
  );
}
