import { notFound } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listOrgRewards } from "@/server/actions/loyalty";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewRewardForm } from "./new-reward-form";
import { RewardRow } from "./reward-row";

type Params = Promise<{ slug: string }>;

export default async function RewardsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const items = await listOrgRewards(org.id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link href={`/org/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← {org.name}
      </Link>
      <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Twinpoints ·
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Premios
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Crea recompensas canjeables con puntos para fidelizar clientes.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo premio</CardTitle>
            <CardDescription>Define coste en puntos y stock (opcional).</CardDescription>
          </CardHeader>
          <CardContent>
            <NewRewardForm organizationId={org.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Premios actuales</CardTitle>
            <CardDescription>
              {items.length === 0 ? "Aún sin premios." : `${items.length} en total`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                <Gift className="size-4" />
                Crea el primero usando el formulario.
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {items.map((r) => (
                  <RewardRow
                    key={r.id}
                    reward={{
                      id: r.id,
                      name: r.name,
                      description: r.description,
                      costPoints: r.costPoints,
                      stock: r.stock,
                      redeemed: r.redeemed,
                      status: r.status,
                    }}
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
