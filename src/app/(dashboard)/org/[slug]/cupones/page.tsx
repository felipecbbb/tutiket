import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listEventsByOrg } from "@/server/actions/events";
import { listCouponsByOrg } from "@/server/actions/coupons";
import { formatDate, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewCouponForm } from "./new-coupon-form";
import { CouponRow } from "./coupon-row";

type Params = Promise<{ slug: string }>;

export default async function CouponsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [coupons, eventsList] = await Promise.all([
    listCouponsByOrg(org.id),
    listEventsByOrg(org.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Cupones de {org.name} ·
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Descuentos
      </h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Crea códigos para promociones, embajadores o early-bird limitado.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo cupón</CardTitle>
            <CardDescription>
              Porcentaje o cantidad fija. Limita usos y vigencia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewCouponForm
              organizationId={org.id}
              events={eventsList.map((e) => ({ id: e.id, name: e.name }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cupones de la organización</CardTitle>
            <CardDescription>
              {coupons.length === 0 ? "Sin cupones aún." : `${coupons.length} en total`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coupons.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Crea tu primer cupón usando el formulario.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {coupons.map((c) => (
                  <CouponRow
                    key={c.id}
                    coupon={{
                      id: c.id,
                      code: c.code,
                      discountLabel:
                        c.discountType === "percentage"
                          ? `${c.discountValue}% off`
                          : `−${formatPrice(c.discountValue)}`,
                      uses: c.uses,
                      maxUses: c.maxUses,
                      status: c.status,
                      window: `${formatDate(c.startDate, { day: "2-digit", month: "short" })} → ${formatDate(c.endDate, { day: "2-digit", month: "short" })}`,
                      eventName:
                        eventsList.find((e) => e.id === c.eventId)?.name ?? null,
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
