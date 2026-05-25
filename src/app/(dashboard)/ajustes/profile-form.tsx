"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { updateMyProfile } from "@/server/actions/profile";

const schema = z.object({
  name: z.string().min(2, "Demasiado corto").max(80),
  surname: z.string().max(80).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  dni: z.string().max(20).optional().or(z.literal("")),
  postalCode: z.string().max(10).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export function ProfileForm({
  initial,
  email,
}: {
  initial: FormValues;
  email: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial,
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await updateMyProfile(values);
      toast.success("Perfil actualizado");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <Input id="email" value={email} disabled />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" {...register("name")} />
        </Field>
        <Field label="Apellidos" htmlFor="surname" error={errors.surname?.message}>
          <Input id="surname" {...register("surname")} />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" {...register("phone")} placeholder="+34 600 00 00 00" />
        </Field>
        <Field label="DNI" htmlFor="dni" error={errors.dni?.message}>
          <Input id="dni" {...register("dni")} />
        </Field>
        <Field
          label="Código postal"
          htmlFor="postalCode"
          error={errors.postalCode?.message}
        >
          <Input id="postalCode" {...register("postalCode")} />
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
