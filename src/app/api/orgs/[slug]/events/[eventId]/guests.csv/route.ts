import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/db/schema";
import { getOrganizationBySlug } from "@/server/actions/organizations";
import { listEventGuests } from "@/server/actions/guests";

type RouteParams = { params: Promise<{ slug: string; eventId: string }> };

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(_: Request, { params }: RouteParams) {
  const { slug, eventId } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [evt] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!evt || evt.organizationId !== org.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const guests = await listEventGuests(eventId);

  const lines = ["nombre,email,prepaid,qr"];
  for (const g of guests) {
    lines.push(
      [g.name, g.email ?? "", g.prepaid ? "si" : "no", g.qrCode]
        .map((v) => escapeCsv(String(v)))
        .join(","),
    );
  }
  const csv = lines.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="invitados-${evt.slug}.csv"`,
    },
  });
}
