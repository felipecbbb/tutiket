import type { Metadata } from "next";
import Link from "next/link";
import { NewPasswordForm } from "./new-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nueva contraseña",
};

type SearchParams = Promise<{ token?: string; error?: string }>;

export default async function NewPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token, error } = await searchParams;

  if (error || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enlace no válido</CardTitle>
          <CardDescription>
            {error === "INVALID_TOKEN"
              ? "El enlace expiró o ya fue usado."
              : "Pide uno nuevo desde la página de recuperar contraseña."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/recuperar"
            className="text-sm font-medium text-primary hover:underline"
          >
            Pedir un enlace nuevo →
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear nueva contraseña</CardTitle>
        <CardDescription>Elige una contraseña con al menos 8 caracteres.</CardDescription>
      </CardHeader>
      <CardContent>
        <NewPasswordForm token={token} />
      </CardContent>
    </Card>
  );
}
