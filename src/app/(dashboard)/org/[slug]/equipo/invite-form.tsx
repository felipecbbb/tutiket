"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createInvitationSchema,
  invitationRoleValues,
  type CreateInvitationInput,
} from "@/lib/validations/invitation";
import { createInvitation } from "@/server/actions/invitations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

const ROLE_LABELS: Record<(typeof invitationRoleValues)[number], string> = {
  validator: "Validador — escanea entradas en la puerta",
  pr_member: "RR.PP. — vende con tu link de afiliado",
  pr_manager: "Responsable RR.PP. — gestiona el equipo",
  organizer: "Organizador — permisos completos sobre la org",
};

export function InviteForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInvitationInput>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      organizationId,
      email: "",
      role: "validator",
      message: "",
    },
  });

  async function onSubmit(values: CreateInvitationInput) {
    setSubmitting(true);
    try {
      await createInvitation(values);
      toast.success(`Invitación enviada a ${values.email}`);
      reset({ organizationId, email: "", role: values.role, message: "" });
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

      <Field label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          placeholder="persona@email.com"
          {...register("email")}
        />
      </Field>

      <Field label="Rol" htmlFor="role" error={errors.role?.message} required>
        <select
          id="role"
          {...register("role")}
          className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {invitationRoleValues.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Mensaje (opcional)"
        htmlFor="message"
        error={errors.message?.message}
      >
        <textarea
          id="message"
          {...register("message")}
          rows={3}
          placeholder="Te invito a ayudarme con la noche del sábado…"
          className="rounded-lg border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Enviando…" : "Enviar invitación"}
      </Button>
    </form>
  );
}
