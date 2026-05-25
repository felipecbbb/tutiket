"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import {
  createCouponSchema,
  type CreateCouponInput,
} from "@/lib/validations/coupon";
import { createCoupon } from "@/server/actions/coupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

type FormInput = z.input<typeof createCouponSchema>;

export function NewCouponForm({
  organizationId,
  events,
}: {
  organizationId: string;
  events: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, CreateCouponInput>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      organizationId,
      code: "",
      discountType: "percentage",
      discountValue: 10,
      maxUses: 100,
      eventId: "",
    },
  });

  const discountType = useWatch({ control, name: "discountType" });

  async function onSubmit(values: CreateCouponInput) {
    setSubmitting(true);
    try {
      await createCoupon(values);
      toast.success("Cupón creado");
      reset({
        organizationId,
        code: "",
        discountType: "percentage",
        discountValue: 10,
        maxUses: 100,
        eventId: "",
      });
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

      <Field label="Código" htmlFor="code" error={errors.code?.message} required>
        <Input
          id="code"
          {...register("code")}
          placeholder="EARLYBIRD25"
          className="font-mono uppercase"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Tipo"
          htmlFor="discountType"
          error={errors.discountType?.message}
          required
        >
          <select
            id="discountType"
            {...register("discountType")}
            className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="percentage">Porcentaje (%)</option>
            <option value="fixed">Cantidad fija (€)</option>
          </select>
        </Field>
        <Field
          label={discountType === "percentage" ? "Porcentaje" : "Céntimos"}
          htmlFor="discountValue"
          hint={discountType === "fixed" ? "Ej: 500 = 5€" : "Ej: 25 = 25%"}
          error={errors.discountValue?.message}
          required
        >
          <Input
            id="discountValue"
            type="number"
            inputMode="numeric"
            {...register("discountValue")}
          />
        </Field>
      </div>

      <Field
        label="Máximo de usos"
        htmlFor="maxUses"
        error={errors.maxUses?.message}
        required
      >
        <Input id="maxUses" type="number" inputMode="numeric" {...register("maxUses")} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Inicio"
          htmlFor="startDate"
          error={errors.startDate?.message}
          required
        >
          <Input id="startDate" type="datetime-local" {...register("startDate")} />
        </Field>
        <Field
          label="Fin"
          htmlFor="endDate"
          error={errors.endDate?.message}
          required
        >
          <Input id="endDate" type="datetime-local" {...register("endDate")} />
        </Field>
      </div>

      <Field
        label="Evento (opcional)"
        htmlFor="eventId"
        hint="Si lo dejas vacío, aplica a toda la organización"
        error={errors.eventId?.message}
      >
        <select
          id="eventId"
          {...register("eventId")}
          className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">— Toda la organización —</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </Field>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Creando…" : "Crear cupón"}
      </Button>
    </form>
  );
}
