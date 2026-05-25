import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getInvitationByToken } from "@/server/actions/invitations";
import { getCurrentUser } from "@/server/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AcceptInvitationButton } from "./accept-button";

export const dynamic = "force-dynamic";

type Params = Promise<{ token: string }>;

const ROLE_LABELS: Record<string, string> = {
  validator: "Validador (escanear entradas en la puerta)",
  pr_member: "RR.PP. (vender con comisión)",
  pr_manager: "Responsable de RR.PP. (gestionar equipo)",
  organizer: "Organizador (crear y gestionar eventos)",
};

export const metadata: Metadata = { title: "Invitación" };

export default async function InvitationPage({ params }: { params: Params }) {
  const { token } = await params;
  const inv = await getInvitationByToken(token);

  if (!inv) {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Invitación no encontrada</CardTitle>
            <CardDescription>El enlace no es válido o ha sido revocado.</CardDescription>
          </CardHeader>
        </Card>
      </Wrapper>
    );
  }

  if (inv.status === "expired" || inv.expiresAt < new Date()) {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Invitación expirada</CardTitle>
            <CardDescription>
              Pide a {inv.inviterName} que te envíe una nueva.
            </CardDescription>
          </CardHeader>
        </Card>
      </Wrapper>
    );
  }
  if (inv.status === "revoked") {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Invitación revocada</CardTitle>
            <CardDescription>Ya no está disponible.</CardDescription>
          </CardHeader>
        </Card>
      </Wrapper>
    );
  }
  if (inv.status === "accepted") {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Ya aceptada</CardTitle>
            <CardDescription>
              Esta invitación ya fue aceptada anteriormente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mi" className="text-primary hover:underline">
              Ir a mi cuenta →
            </Link>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  const currentUser = await getCurrentUser();

  // Sin sesión: pedir login/registro con redirect de vuelta aquí
  if (!currentUser) {
    redirect(`/login?redirect=/invitacion/${token}`);
  }

  // Sesión con email distinto: bloquear
  if (currentUser.email.toLowerCase() !== inv.email.toLowerCase()) {
    return (
      <Wrapper>
        <Card>
          <CardHeader>
            <CardTitle>Email no coincide</CardTitle>
            <CardDescription>
              Esta invitación fue enviada a <b>{inv.email}</b>, pero tu sesión
              está en <b>{currentUser.email}</b>. Sal y entra con el email
              correcto.
            </CardDescription>
          </CardHeader>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <CardTitle>Acepta la invitación</CardTitle>
          <CardDescription>
            <b>{inv.inviterName}</b> te invita
            {inv.organization ? (
              <>
                {" "}a colaborar en <b>{inv.organization.name}</b>
              </>
            ) : null}{" "}
            como:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-5 rounded-lg border border-border bg-muted/40 px-4 py-3">
            <p className="font-medium">{ROLE_LABELS[inv.role] ?? inv.role}</p>
          </div>
          {inv.message && (
            <p className="mb-5 italic text-sm text-muted-foreground">
              “{inv.message}”
            </p>
          )}
          <AcceptInvitationButton token={token} />
        </CardContent>
      </Card>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
