import { notFound } from "next/navigation";
import { Mail, RefreshCw, X } from "lucide-react";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listOrgInvitations } from "@/server/actions/invitations";
import { listOrgMembers } from "@/server/actions/memberships";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteForm } from "./invite-form";
import { RevokeButton } from "./revoke-button";
import { MemberRow } from "./member-row";

type Params = Promise<{ slug: string }>;

const INV_ROLE_LABELS: Record<string, string> = {
  validator: "Validador",
  pr_member: "RR.PP.",
  pr_manager: "Resp. RR.PP.",
  organizer: "Organizador",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-primary/20 text-primary",
  accepted: "bg-accent/30 text-accent-foreground",
  revoked: "bg-muted text-muted-foreground",
  expired: "bg-destructive/20 text-destructive",
};

export default async function TeamPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [invs, members] = await Promise.all([
    listOrgInvitations(org.id),
    listOrgMembers(org.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Equipo de {org.name} ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Tu gente
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Invita validadores para escanear en la puerta, RR.PP. para vender con
        comisión, o co-organizadores con permisos completos.
      </p>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">
            Miembros activos ({members.length})
          </h2>
        </div>
        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            Aún no hay miembros. Empieza enviando una invitación abajo.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Persona</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Rol</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <MemberRow
                    key={m.userId}
                    member={{
                      organizationId: org.id,
                      userId: m.userId,
                      name: m.name,
                      email: m.email,
                      role: m.role,
                      status: m.status,
                      createdAt: formatDate(m.createdAt, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }),
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nueva invitación</CardTitle>
            <CardDescription>Se manda un email con un enlace de 7 días.</CardDescription>
          </CardHeader>
          <CardContent>
            <InviteForm organizationId={org.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitaciones</CardTitle>
            <CardDescription>
              {invs.length === 0
                ? "Aún no has enviado ninguna."
                : `${invs.length} en total`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invs.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                <Mail className="size-4" />
                Aquí aparecerán las invitaciones enviadas.
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {invs.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${STATUS_BADGE[inv.status]}`}
                        >
                          {inv.status}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                          {INV_ROLE_LABELS[inv.role] ?? inv.role}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-medium text-sm">{inv.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {inv.status === "pending" && inv.expiresAt > new Date() ? (
                          <>
                            <RefreshCw className="inline size-3 mr-1" />
                            Expira{" "}
                            {formatDate(inv.expiresAt, {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        ) : inv.acceptedAt ? (
                          <>
                            Aceptada{" "}
                            {formatDate(inv.acceptedAt, {
                              day: "2-digit",
                              month: "short",
                            })}
                          </>
                        ) : (
                          <>
                            Creada{" "}
                            {formatDate(inv.createdAt, {
                              day: "2-digit",
                              month: "short",
                            })}
                          </>
                        )}
                      </p>
                    </div>
                    {inv.status === "pending" && (
                      <RevokeButton id={inv.id} aria-label="Revocar invitación">
                        <X className="size-4" />
                      </RevokeButton>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
