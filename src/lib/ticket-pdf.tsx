import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, tickets, ticketTypes, venues, organizations } from "@/db/schema";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#faf6ee",
    padding: 40,
    fontFamily: "Helvetica",
    color: "#1a1410",
  },
  brandRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottom: "1pt solid #1a1410",
    paddingBottom: 12,
  },
  brand: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 1,
  },
  small: {
    fontSize: 9,
    color: "#7a6f60",
  },
  ticketCard: {
    border: "1.5pt solid #1a1410",
    borderRadius: 10,
    padding: 24,
    backgroundColor: "#ffffff",
  },
  eventName: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 6,
  },
  meta: {
    fontSize: 11,
    color: "#5a4f40",
    marginBottom: 4,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginTop: 18,
    gap: 16,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: "#7a6f60",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 700,
  },
  qrWrap: {
    alignItems: "center",
    marginTop: 24,
    paddingTop: 18,
    borderTop: "1pt dashed #b8aa92",
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  footer: {
    marginTop: 24,
    fontSize: 8,
    color: "#7a6f60",
    textAlign: "center",
  },
});

type TicketPdfData = {
  ticketId: string;
  orderRef: string;
  qrDataUrl: string;
  eventName: string;
  eventDate: string;
  location: string;
  organizationName: string;
  ticketTypeName: string;
  priceCents: number;
  attendee?: string;
};

function TicketPdf({ data }: { data: TicketPdfData }) {
  const formattedPrice = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(data.priceCents / 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>TUTIKET</Text>
          <Text style={styles.small}>Ref. {data.orderRef}</Text>
        </View>

        <View style={styles.ticketCard}>
          <Text style={styles.eventName}>{data.eventName}</Text>
          <Text style={styles.meta}>{data.eventDate}</Text>
          <Text style={styles.meta}>{data.location}</Text>
          <Text style={styles.meta}>Organiza: {data.organizationName}</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Entrada</Text>
              <Text style={styles.value}>{data.ticketTypeName}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Precio</Text>
              <Text style={styles.value}>{formattedPrice}</Text>
            </View>
            {data.attendee && (
              <View style={styles.col}>
                <Text style={styles.label}>A nombre de</Text>
                <Text style={styles.value}>{data.attendee}</Text>
              </View>
            )}
          </View>

          <View style={styles.qrWrap}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={data.qrDataUrl} style={styles.qrImage} />
            <Text style={[styles.small, { marginTop: 8 }]}>
              Ticket ID: {data.ticketId}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Presenta este código QR en la puerta. La firma HMAC se verifica al
          escanear; no se puede falsificar. Cualquier duda: soporte@tutiket.app
        </Text>
      </Page>
    </Document>
  );
}

/** Carga el ticket y genera el PDF como Buffer. */
export async function renderTicketPdf(ticketId: string): Promise<Buffer> {
  const [ticket] = await db.select().from(tickets).where(eq(tickets.id, ticketId)).limit(1);
  if (!ticket) throw new Error("Ticket no encontrado");

  const [evt] = await db.select().from(events).where(eq(events.id, ticket.eventId)).limit(1);
  if (!evt) throw new Error("Evento no encontrado");

  const [tt] = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.id, ticket.ticketTypeId))
    .limit(1);

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, evt.organizationId))
    .limit(1);

  const venue = evt.venueId
    ? (await db.select().from(venues).where(eq(venues.id, evt.venueId)).limit(1))[0]
    : null;

  const qrDataUrl = await QRCode.toDataURL(ticket.qrCode, {
    width: 540,
    margin: 1,
    errorCorrectionLevel: "M",
  });

  const formatter = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const attendee = ticket.attendeeName
    ? `${ticket.attendeeName}${ticket.attendeeSurname ? " " + ticket.attendeeSurname : ""}`
    : undefined;

  const data: TicketPdfData = {
    ticketId: ticket.id,
    orderRef: ticket.orderRef,
    qrDataUrl,
    eventName: evt.name,
    eventDate: formatter.format(evt.startDate),
    location: venue?.name ?? evt.location,
    organizationName: org?.name ?? "—",
    ticketTypeName: tt?.name ?? ticket.kind,
    priceCents: ticket.priceCents,
    attendee,
  };

  return renderToBuffer(<TicketPdf data={data} />);
}
