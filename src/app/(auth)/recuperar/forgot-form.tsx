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

const schema = z.object({
  email: z.string().email("Email no válido"),
});
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/recuperar/nueva",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "Algo salió mal");
      return;
    }
    setSent(true);
    toast.success("Email enviado");
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
        Si ese email existe en nuestra base, recibirás un enlace en breve.
        Revisa también spam.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
