import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Download, Users } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { events } from "@/db/schema";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listEventGuests } from "@/server/actions/guests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkGuestForm } from "./bulk-form";
import { GuestRow } from "./guest-row";

type Params = Promise<{ slug: string; eventId: string }>;

export default async function GuestsPage({ params }: { params: Params }) {
  const { slug, eventId } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const [evt] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!evt || evt.organizationId !== org.id) notFound();

  const guests = await listEventGuests(eventId);
  const prepaidCount = guests.filter((g) => g.prepaid).length;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={`/org/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver a {org.name}
      </Link>
      <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        · Lista de invitados ·
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">
        {evt.name}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {guests.length} invitados · {prepaidCount} prepagados
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={`/api/orgs/${slug}/events/${eventId}/guests.csv`}>
            <Download className="size-4" />
            Exportar CSV
          </a>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <Card>
          <CardHeader>
            <CardTitle>Añadir invitados</CardTitle>
            <CardDescription>
              Pega tu lista. Una persona por línea: nombre, email (opcional),
              prepaid (sí/no opcional).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BulkGuestForm eventId={eventId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitados</CardTitle>
            <CardDescription>
              {guests.length === 0 ? "Aún no hay invitados." : `${guests.length} en la lista`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {guests.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                <Users className="size-4" />
                Aquí aparecerán los invitados que añadas.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Nombre</th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">Tipo</th>
                      <th className="px-3 py-2 text-right font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((g) => (
                      <GuestRow
                        key={g.id}
                        guest={{
                          id: g.id,
                          name: g.name,
                          email: g.email,
                          prepaid: g.prepaid,
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
