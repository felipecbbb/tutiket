import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireSession();

  const [u] = await db
    .select({
      name: user.name,
      email: user.email,
      surname: user.surname,
      phone: user.phone,
      dni: user.dni,
      postalCode: user.postalCode,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Ajustes ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Tu cuenta
      </h1>

      <div className="mt-10 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Datos personales y de contacto.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              initial={{
                name: u?.name ?? session.user.name,
                surname: u?.surname ?? "",
                phone: u?.phone ?? "",
                dni: u?.dni ?? "",
                postalCode: u?.postalCode ?? "",
              }}
              email={session.user.email}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar contraseña</CardTitle>
            <CardDescription>
              Necesitarás tu contraseña actual. Mínimo 8 caracteres.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
