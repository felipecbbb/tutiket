"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { Plus, Trash2, X } from "lucide-react";
import {
  createTicketTypeSchema,
  ticketKindValues,
  type CreateTicketTypeInput,
} from "@/lib/validations/ticket-type";
import {
  createTicketType,
  deleteTicketType,
} from "@/server/actions/ticket-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type FormInput = z.input<typeof createTicketTypeSchema>;

const KIND_LABEL: Record<(typeof ticketKindValues)[number], string> = {
  general: "General",
  vip: "VIP",
  guestlist: "Guest list (gratis)",
  early_bird: "Early bird",
};

type TicketType = {
  id: string;
  name: string;
  description: string | null;
  kind: (typeof ticketKindValues)[number];
  priceCents: number;
  maxQuantity: number;
  soldQuantity: number;
  userLimit: number;
  isNominative: boolean;
};

export function TicketTypesSection({
  eventId,
  ticketTypes,
}: {
  eventId: string;
  ticketTypes: TicketType[];
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Tipos de entrada</h2>
        <Button size="sm" onClick={() => setCreating((c) => !c)}>
          {creating ? <X className="size-4" /> : <Plus className="size-4" />}
          {creating ? "Cancelar" : "Nuevo tipo"}
        </Button>
      </div>

      {creating && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Nuevo tipo de entrada</CardTitle>
          </CardHeader>
          <CardContent>
            <NewTicketTypeForm
              eventId={eventId}
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      )}

      {ticketTypes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground text-center">
          Crea al menos un tipo de entrada antes de publicar el evento.
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {ticketTypes.map((tt) => (
            <li key={tt.id}>
              <TicketTypeCard tt={tt} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function TicketTypeCard({ tt }: { tt: TicketType }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (tt.soldQuantity > 0) {
      toast.error("No se puede borrar: ya hay entradas vendidas");
      return;
    }
    if (!confirm(`¿Eliminar tipo "${tt.name}"?`)) return;
    startTransition(async () => {
      try {
        await deleteTicketType(tt.id);
        toast.success("Eliminado");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                tt.kind === "vip"
                  ? "bg-primary/20 text-primary"
                  : tt.kind === "guestlist"
                    ? "bg-accent/30 text-accent-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {KIND_LABEL[tt.kind]}
            </span>
            {tt.isNominative && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                Nominativa
              </span>
            )}
          </div>
          <p className="mt-1 font-display text-lg font-bold truncate">{tt.name}</p>
          {tt.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{tt.description}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-xl font-bold text-primary">
            {formatPrice(tt.priceCents)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="text-xs text-muted-foreground">
          {tt.soldQuantity}/{tt.maxQuantity} vendidas · máx {tt.userLimit}/usuario
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          aria-label="Eliminar"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function NewTicketTypeForm({
  eventId,
  onDone,
}: {
  eventId: string;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput, unknown, CreateTicketTypeInput>({
    resolver: zodResolver(createTicketTypeSchema),
    defaultValues: {
      eventId,
      name: "",
      kind: "general",
      priceCents: 1000,
      maxQuantity: 100,
      userLimit: 10,
      isNominative: false,
    },
  });

  async function onSubmit(values: CreateTicketTypeInput) {
    try {
      await createTicketType(values);
      toast.success("Tipo creado");
      reset();
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("eventId")} value={eventId} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre" htmlFor="tt-name" error={errors.name?.message} required>
          <Input id="tt-name" {...register("name")} placeholder="Entrada general" />
        </Field>
        <Field label="Tipo" htmlFor="tt-kind" error={errors.kind?.message} required>
          <select
            id="tt-kind"
            {...register("kind")}
            className="h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ticketKindValues.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Descripción" htmlFor="tt-desc" error={errors.description?.message}>
        <Input
          id="tt-desc"
          {...register("description")}
          placeholder="Incluye 1 consumición"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="Precio (céntimos)"
          htmlFor="tt-price"
          hint="1000 = 10€"
          error={errors.priceCents?.message}
          required
        >
          <Input
            id="tt-price"
            type="number"
            min={0}
            inputMode="numeric"
            {...register("priceCents")}
          />
        </Field>
        <Field
          label="Cantidad máxima"
          htmlFor="tt-max"
          error={errors.maxQuantity?.message}
          required
        >
          <Input
            id="tt-max"
            type="number"
            min={1}
            inputMode="numeric"
            {...register("maxQuantity")}
          />
        </Field>
        <Field
          label="Máx por usuario"
          htmlFor="tt-userlimit"
          error={errors.userLimit?.message}
          required
        >
          <Input
            id="tt-userlimit"
            type="number"
            min={1}
            inputMode="numeric"
            {...register("userLimit")}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Inicio venta (opcional)"
          htmlFor="tt-sstart"
          error={errors.saleStartDate?.message}
        >
          <Input
            id="tt-sstart"
            type="datetime-local"
            {...register("saleStartDate")}
          />
        </Field>
        <Field
          label="Fin venta (opcional)"
          htmlFor="tt-send"
          error={errors.saleEndDate?.message}
        >
          <Input id="tt-send" type="datetime-local" {...register("saleEndDate")} />
        </Field>
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isNominative")} />
        Entrada nominativa (pide DNI/nombre del asistente)
      </label>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Creando…" : "Crear tipo de entrada"}
      </Button>
    </form>
  );
}
