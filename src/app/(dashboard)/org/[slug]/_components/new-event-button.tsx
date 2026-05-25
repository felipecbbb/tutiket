"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { createEventSchema, type CreateEventInput } from "@/lib/validations/event";
import { createEvent } from "@/server/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";

type FormInput = z.input<typeof createEventSchema>;

type Props = {
  organizationId: string;
  venues: { id: string; name: string }[];
};

export function NewEventButton({ organizationId, venues }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    try {
      await createEvent(values);
      toast.success("Evento creado como borrador");
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nuevo evento
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo evento"
        description="Se crea como borrador. Lo publicas cuando esté listo."
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="hidden"
            {...register("organizationId")}
            value={organizationId}
          />

          <Field label="Nombre" htmlFor="name" error={errors.name?.message} required>
            <Input id="name" {...register("name")} placeholder="Lights Off — techno" />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Categoría" htmlFor="category" error={errors.category?.message} required>
              <Input
                id="category"
                {...register("category")}
                placeholder="techno · house · live"
              />
            </Field>
            <Field label="Aforo" htmlFor="capacity" error={errors.capacity?.message} required>
              <Input id="capacity" type="number" {...register("capacity")} />
            </Field>
          </div>

          <Field label="Ubicación" htmlFor="location" error={errors.location?.message} required>
            <Input id="location" {...register("location")} placeholder="C/ Triana 51" />
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
            <Field label="Inicio" htmlFor="startDate" error={errors.startDate?.message} required>
              <Input id="startDate" type="datetime-local" {...register("startDate")} />
            </Field>
            <Field label="Fin" htmlFor="endDate" error={errors.endDate?.message} required>
              <Input id="endDate" type="datetime-local" {...register("endDate")} />
            </Field>
          </div>

          <Field label="Descripción" htmlFor="description" error={errors.description?.message}>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando…" : "Crear evento"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
