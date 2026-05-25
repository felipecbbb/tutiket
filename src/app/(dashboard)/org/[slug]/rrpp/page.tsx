import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import {
  listOrgPrMembers,
  listPrTeams,
  getPrMemberStats,
} from "@/server/actions/pr";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewTeamForm } from "./new-team-form";
import { CommissionInput } from "./commission-input";

type Params = Promise<{ slug: string }>;

export default async function PrPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [teams, members] = await Promise.all([
    listPrTeams(org.id),
    listOrgPrMembers(org.id),
  ]);

  // Stats por miembro
  const memberStats = await Promise.all(
    members.map(async (m) => ({
      member: m,
      stats: await getPrMemberStats(m.id),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href={`/org/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {org.name}
      </Link>
      <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Relaciones Públicas ·
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Equipo RR.PP.
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Gestiona tus equipos de venta, comisiones por miembro y ventas
        atribuidas. Para añadir nuevos miembros, invita desde{" "}
        <Link href={`/org/${slug}/equipo`} className="underline">
          Equipo
        </Link>{" "}
        con rol RR.PP. o Responsable RR.PP.
      </p>

      {/* Equipos */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Equipos ({teams.length})</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo equipo</CardTitle>
              <CardDescription>
                Agrupa miembros con misma comisión, fácil de asignar a eventos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewTeamForm organizationId={org.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipos existentes</CardTitle>
              <CardDescription>
                {teams.length === 0 ? "Aún sin equipos." : `${teams.length} equipos`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Crea tu primer equipo para empezar.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {teams.map((t) => (
                    <li
                      key={t.id}
                      className="rounded-lg border border-border bg-background px-3 py-2.5"
                    >
                      <p className="font-medium">{t.name}</p>
                      {t.description && (
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Miembros */}
      <section className="mt-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            Miembros ({members.length})
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link href={`/org/${slug}/equipo`}>
              <Plus className="size-4" />
              Invitar nuevo
            </Link>
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <Users className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Aún sin miembros. Invita personas como{" "}
              <b>RR.PP.</b> desde el panel de Equipo.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Miembro</th>
                  <th className="px-4 py-3 text-left font-medium">Código</th>
                  <th className="px-4 py-3 text-left font-medium">Comisión</th>
                  <th className="px-4 py-3 text-right font-medium">Ventas</th>
                  <th className="px-4 py-3 text-right font-medium">Comisión ganada</th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map(({ member, stats }) => (
                  <tr
                    key={member.id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {member.code ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <CommissionInput
                        memberId={member.id}
                        initialBps={member.commissionBps}
                      />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{stats.qty}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatPrice(stats.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
