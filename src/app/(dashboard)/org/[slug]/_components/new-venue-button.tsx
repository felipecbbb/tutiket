"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { createVenueSchema, type CreateVenueInput } from "@/lib/validations/venue";
import { createVenue } from "@/server/actions/venues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";

type FormInput = z.input<typeof createVenueSchema>;

export function NewVenueButton({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    try {
      await createVenue(values);
      toast.success("Local creado");
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nuevo local
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Nuevo local"
        description="Lugar físico donde se celebran tus eventos."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input type="hidden" {...register("organizationId")} value={organizationId} />

          <Field label="Nombre" htmlFor="vname" error={errors.name?.message} required>
            <Input id="vname" {...register("name")} placeholder="Sala Principal" />
          </Field>

          <Field
            label="Ubicación"
            htmlFor="vlocation"
            error={errors.location?.message}
            required
          >
            <Input id="vlocation" {...register("location")} placeholder="C/ Triana 51, LPGC" />
          </Field>

          <Field label="Aforo" htmlFor="vcapacity" error={errors.capacity?.message} required>
            <Input id="vcapacity" type="number" {...register("capacity")} />
          </Field>

          <Field label="Descripción" htmlFor="vdesc" error={errors.description?.message}>
            <textarea
              id="vdesc"
              {...register("description")}
              rows={3}
              className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isPrimary")} />
            Marcar como local principal
          </label>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando…" : "Crear local"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
