import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./register-form";
import { env } from "@/lib/env";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Únete y empieza a vender entradas",
};

export default function RegisterPage() {
  const hasGoogle = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          En 30 segundos. Sin tarjeta, sin compromisos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm hasGoogle={hasGoogle} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
