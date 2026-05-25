import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tickets } from "@/db/schema";
import { getCurrentUser } from "@/server/auth";
import { renderTicketPdf } from "@/lib/ticket-pdf";

type RouteParams = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Solo el dueño del ticket o admin pueden descargar
  const [t] = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const role = (user as { role?: string }).role;
  if (role !== "admin" && t.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await renderTicketPdf(id);
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="ticket-${t.orderRef}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[ticket-pdf]", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
