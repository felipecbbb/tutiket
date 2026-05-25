"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    password: z.string().min(8, "Mínimo 8 caracteres").max(128, "Demasiado larga"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof schema>;

export function NewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "No hemos podido cambiar la contraseña");
      return;
    }
    toast.success("Contraseña actualizada");
    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Nueva contraseña" htmlFor="password" error={errors.password?.message} required>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </Field>

      <Field label="Confirmar" htmlFor="confirm" error={errors.confirm?.message} required>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          invalid={Boolean(errors.confirm)}
          {...register("confirm")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Actualizando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
