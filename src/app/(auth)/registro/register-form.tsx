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
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  name: z.string().min(2, "Demasiado corto").max(80, "Demasiado largo"),
  email: z.string().email("Email no válido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(128, "Demasiado larga"),
});
type FormValues = z.infer<typeof schema>;

export function RegisterForm({ hasGoogle }: { hasGoogle: boolean }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/mi",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "No hemos podido crear la cuenta");
      return;
    }
    toast.success("¡Bienvenido!");
    router.push("/mi");
    router.refresh();
  }

  async function onGoogle() {
    setGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/mi",
    });
    if (error) {
      setGoogleLoading(false);
      toast.error(error.message ?? "Error con Google");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {hasGoogle && (
        <>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onGoogle}
            disabled={googleLoading}
          >
            <GoogleIcon />
            {googleLoading ? "Conectando…" : "Crear cuenta con Google"}
          </Button>
          <Separator label="o con tu email" />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Nombre" htmlFor="name" error={errors.name?.message} required>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="María García"
            invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>

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

        <Field
          label="Contraseña"
          htmlFor="password"
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          required
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </Field>

        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Creando cuenta…" : "Crear cuenta"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Al crear cuenta aceptas nuestros{" "}
          <a href="/legal/terminos" className="underline">términos</a> y{" "}
          <a href="/legal/privacidad" className="underline">política de privacidad</a>.
        </p>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
