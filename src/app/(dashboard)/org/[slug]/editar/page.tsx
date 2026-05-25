import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditOrgForm } from "./edit-form";

type Params = Promise<{ slug: string }>;

export default async function EditOrgPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/org/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← {org.name}
      </Link>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Editar organización</CardTitle>
          <CardDescription>
            Actualiza la información pública. Para datos fiscales y bancarios usa
            la pestaña separada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditOrgForm
            orgId={org.id}
            slug={org.slug}
            initial={{
              name: org.name,
              sector: org.sector,
              description: org.description ?? "",
              location: org.location ?? "",
              capacity: org.capacity ?? undefined,
              openingHours: org.openingHours ?? "",
              logoUrl: org.logoUrl ?? "",
              coverUrl: org.coverUrl ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
