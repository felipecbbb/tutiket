import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { env } from "@/lib/env";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Accede a tu cuenta",
};

export default function LoginPage() {
  const hasGoogle = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Bienvenido de vuelta. Entra para gestionar tus eventos y entradas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm hasGoogle={hasGoogle} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-primary hover:underline">
            Crear una
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
