import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { getOrgInfo } from "@/server/actions/organization-info";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiscalForm } from "./fiscal-form";

type Params = Promise<{ slug: string }>;

export default async function FiscalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();
  const info = await getOrgInfo(org.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Datos fiscales</CardTitle>
          <CardDescription>
            Información usada para facturación, contratos con plataformas de pago
            y notificaciones legales. Solo el owner y admins pueden editarla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FiscalForm
            organizationId={org.id}
            initial={{
              legalName: info?.legalName ?? "",
              commercialName: info?.commercialName ?? "",
              cifNif: info?.cifNif ?? "",
              address: info?.address ?? "",
              postalCode: info?.postalCode ?? "",
              city: info?.city ?? "",
              country: info?.country ?? "ES",
              iban: info?.iban ?? "",
              bicSwift: info?.bicSwift ?? "",
              phone: info?.phone ?? "",
              financialEmail: info?.financialEmail ?? "",
              customerServiceEmail: info?.customerServiceEmail ?? "",
              privacyPolicyUrl: info?.privacyPolicyUrl ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
