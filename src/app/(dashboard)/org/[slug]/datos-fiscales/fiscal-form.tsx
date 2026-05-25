"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { orgInfoSchema, type OrgInfoInput } from "@/lib/validations/organization-info";
import { upsertOrgInfo } from "@/server/actions/organization-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

type FormInput = z.input<typeof orgInfoSchema>;

type Props = {
  organizationId: string;
  initial: Omit<OrgInfoInput, "organizationId">;
};

export function FiscalForm({ organizationId, initial }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, OrgInfoInput>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: { organizationId, ...initial },
  });

  async function onSubmit(values: OrgInfoInput) {
    setSubmitting(true);
    try {
      await upsertOrgInfo(values);
      toast.success("Datos guardados");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <input type="hidden" {...register("organizationId")} value={organizationId} />

      <Section title="Identificación">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Razón social" htmlFor="legalName" error={errors.legalName?.message}>
            <Input id="legalName" {...register("legalName")} placeholder="Tutiket Eventos S.L." />
          </Field>
          <Field label="Nombre comercial" htmlFor="commercialName" error={errors.commercialName?.message}>
            <Input id="commercialName" {...register("commercialName")} placeholder="Tutiket" />
          </Field>
          <Field label="CIF / NIF" htmlFor="cifNif" error={errors.cifNif?.message}>
            <Input id="cifNif" {...register("cifNif")} placeholder="B12345678" />
          </Field>
          <Field label="Teléfono" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" {...register("phone")} placeholder="+34 600 00 00 00" />
          </Field>
        </div>
      </Section>

      <Section title="Domicilio fiscal">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Dirección" htmlFor="address" error={errors.address?.message} className="md:col-span-2">
            <Input id="address" {...register("address")} placeholder="C/ Triana 51, 1º A" />
          </Field>
          <Field label="Código postal" htmlFor="postalCode" error={errors.postalCode?.message}>
            <Input id="postalCode" {...register("postalCode")} placeholder="35002" />
          </Field>
          <Field label="Ciudad" htmlFor="city" error={errors.city?.message}>
            <Input id="city" {...register("city")} placeholder="Las Palmas de GC" />
          </Field>
          <Field label="País" htmlFor="country" error={errors.country?.message}>
            <Input id="country" {...register("country")} placeholder="ES" />
          </Field>
        </div>
      </Section>

      <Section title="Datos bancarios (opcional)">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="IBAN" htmlFor="iban" error={errors.iban?.message}>
            <Input id="iban" {...register("iban")} placeholder="ES00 0000 0000 0000 0000 0000" />
          </Field>
          <Field label="BIC / SWIFT" htmlFor="bicSwift" error={errors.bicSwift?.message}>
            <Input id="bicSwift" {...register("bicSwift")} placeholder="BBVAESMM" />
          </Field>
        </div>
      </Section>

      <Section title="Contacto">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email financiero" htmlFor="financialEmail" error={errors.financialEmail?.message}>
            <Input id="financialEmail" type="email" {...register("financialEmail")} placeholder="facturacion@dominio.com" />
          </Field>
          <Field label="Email atención cliente" htmlFor="customerServiceEmail" error={errors.customerServiceEmail?.message}>
            <Input id="customerServiceEmail" type="email" {...register("customerServiceEmail")} placeholder="soporte@dominio.com" />
          </Field>
          <Field label="URL política de privacidad" htmlFor="privacyPolicyUrl" error={errors.privacyPolicyUrl?.message} className="md:col-span-2">
            <Input id="privacyPolicyUrl" type="url" {...register("privacyPolicyUrl")} placeholder="https://dominio.com/privacidad" />
          </Field>
        </div>
      </Section>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Guardando…" : "Guardar datos fiscales"}
      </Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold mb-3">{title}</h3>
      {children}
    </div>
  );
}
