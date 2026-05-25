import { describe, it, expect, beforeAll } from "vitest";

// El módulo de QR depende de `env`, que valida en import. Aseguramos vars.
beforeAll(() => {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ?? "postgres://x:y@localhost:5432/z?sslmode=require";
  process.env.BETTER_AUTH_SECRET =
    process.env.BETTER_AUTH_SECRET ?? "test_secret_at_least_32_chars_long_xx";
  process.env.NEXT_PUBLIC_APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3007";
  process.env.EMAIL_FROM = process.env.EMAIL_FROM ?? "test@example.com";
});

describe("QR HMAC sign/verify", () => {
  it("firma y verifica un ticketId correctamente", async () => {
    const { signTicketQR, verifyTicketQR } = await import("@/lib/qr");
    const ticketId = "abc-123-xyz";
    const qr = signTicketQR(ticketId);
    expect(qr).toContain(".");
    expect(qr.startsWith(`${ticketId}.`)).toBe(true);
    expect(verifyTicketQR(qr)).toBe(ticketId);
  });

  it("rechaza QR con firma alterada", async () => {
    const { signTicketQR, verifyTicketQR } = await import("@/lib/qr");
    const qr = signTicketQR("uno");
    const tampered = qr.slice(0, -1) + (qr.slice(-1) === "a" ? "b" : "a");
    expect(verifyTicketQR(tampered)).toBeNull();
  });

  it("rechaza QR sin separador", async () => {
    const { verifyTicketQR } = await import("@/lib/qr");
    expect(verifyTicketQR("solotexto")).toBeNull();
    expect(verifyTicketQR("")).toBeNull();
  });

  it("dos llamadas a sign con el mismo id devuelven la misma firma", async () => {
    const { signTicketQR } = await import("@/lib/qr");
    expect(signTicketQR("foo")).toBe(signTicketQR("foo"));
  });
});
