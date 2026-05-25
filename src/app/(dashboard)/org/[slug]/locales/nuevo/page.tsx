import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { NewVenueForm } from "./new-venue-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Params = Promise<{ slug: string }>;

export default async function NewVenuePage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo local</CardTitle>
          <CardDescription>
            Lugar físico donde se celebran tus eventos. Lo podrás asignar al
            crear el evento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewVenueForm organizationId={org.id} orgSlug={org.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
