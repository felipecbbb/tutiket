"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
type FormValues = z.infer<typeof schema>;

export function LoginForm({ hasGoogle }: { hasGoogle: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/mi";

  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: redirectTo,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "No hemos podido iniciar sesión");
      return;
    }
    toast.success("¡Dentro!");
    router.push(redirectTo);
    router.refresh();
  }

  async function onGoogle() {
    setGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });
    if (error) {
      setGoogleLoading(false);
      toast.error(error.message ?? "Error con Google");
    }
  }

  async function onMagicLink() {
    const email = getValues("email");
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) {
      toast.error("Escribe tu email arriba primero");
      return;
    }
    setMagicLoading(true);
    const { error } = await authClient.signIn.magicLink({
      email: parsed.data,
      callbackURL: redirectTo,
    });
    setMagicLoading(false);
    if (error) {
      toast.error(error.message ?? "No hemos podido enviar el enlace");
      return;
    }
    toast.success("Te hemos enviado un enlace a tu email");
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
            {googleLoading ? "Conectando…" : "Entrar con Google"}
          </Button>
          <Separator label="o con tu email" />
        </>
      )}

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

        <Field
          label="Contraseña"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </Field>

        <div className="-mt-1 text-right">
          <Link
            href="/recuperar"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <Separator label="o" />

      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onMagicLink}
        disabled={magicLoading}
      >
        <Mail className="size-4" />
        {magicLoading ? "Enviando…" : "Enviarme un enlace mágico"}
      </Button>
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
