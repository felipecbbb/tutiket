"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

const schema = z
  .object({
    currentPassword: z.string().min(8, "Mínimo 8 caracteres"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres").max(128),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof schema>;

export function PasswordForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "No se pudo cambiar");
      return;
    }
    toast.success("Contraseña actualizada");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field
        label="Contraseña actual"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
        required
      >
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nueva contraseña"
          htmlFor="newPassword"
          error={errors.newPassword?.message}
          required
        >
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />
        </Field>
        <Field
          label="Confirmar"
          htmlFor="confirm"
          error={errors.confirm?.message}
          required
        >
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            {...register("confirm")}
          />
        </Field>
      </div>
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Actualizando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
