import { describe, it, expect } from "vitest";

/**
 * Verifica la lógica de cálculo de descuento.
 * Tests aislados (no llaman a previewCoupon que necesita DB).
 */
function calcDiscount(
  type: "percentage" | "fixed",
  value: number,
  priceCents: number,
): number {
  if (type === "percentage") return Math.floor((priceCents * value) / 100);
  return Math.min(priceCents, value);
}

describe("cálculo de descuento", () => {
  it("porcentaje 10% sobre 10€ = 1€", () => {
    expect(calcDiscount("percentage", 10, 1000)).toBe(100);
  });

  it("fijo 5€ sobre 10€ = 5€", () => {
    expect(calcDiscount("fixed", 500, 1000)).toBe(500);
  });

  it("fijo nunca excede el precio", () => {
    expect(calcDiscount("fixed", 2000, 1000)).toBe(1000);
  });

  it("100% = precio completo", () => {
    expect(calcDiscount("percentage", 100, 1234)).toBe(1234);
  });

  it("0% = 0", () => {
    expect(calcDiscount("percentage", 0, 1000)).toBe(0);
  });

  it("redondea a entero (floor)", () => {
    // 33% de 1000 = 330 (entero)
    expect(calcDiscount("percentage", 33, 1000)).toBe(330);
    // 33% de 1001 = 330.33 → 330
    expect(calcDiscount("percentage", 33, 1001)).toBe(330);
  });
});
