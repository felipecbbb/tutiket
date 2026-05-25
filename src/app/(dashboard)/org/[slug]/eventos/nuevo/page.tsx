import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listVenuesByOrg } from "@/server/actions/venues";
import { NewEventForm } from "./new-event-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Params = Promise<{ slug: string }>;

export default async function NewEventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();
  const venues = await listVenuesByOrg(org.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo evento</CardTitle>
          <CardDescription>
            Crea el evento como borrador y publícalo cuando esté listo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewEventForm
            organizationId={org.id}
            orgSlug={org.slug}
            venues={venues.map((v) => ({ id: v.id, name: v.name }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
