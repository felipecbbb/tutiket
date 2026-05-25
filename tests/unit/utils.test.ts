import { describe, it, expect } from "vitest";
import { slugify, formatPrice } from "@/lib/utils";

describe("slugify", () => {
  it("convierte espacios a guiones, baja a minúsculas y normaliza acentos", () => {
    expect(slugify("Sala Berlín")).toBe("sala-berlin");
    expect(slugify("Mañana")).toBe("manana");
  });

  it("colapsa guiones consecutivos", () => {
    expect(slugify("hola --- mundo")).toBe("hola-mundo");
  });

  it("recorta guiones de inicio y fin", () => {
    expect(slugify("  ---hola---  ")).toBe("hola");
  });

  it("string vacío devuelve string vacío", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });

  it("elimina caracteres no alfanuméricos", () => {
    expect(slugify("Crunchy/Rave!?#")).toBe("crunchyrave");
  });
});

describe("formatPrice", () => {
  it("formatea céntimos a euros", () => {
    expect(formatPrice(1000)).toContain("10");
    expect(formatPrice(1500).replace(/\s/g, "")).toMatch(/15,00.*€|€.*15,00/);
  });

  it("0 céntimos = 0€", () => {
    expect(formatPrice(0).replace(/\s/g, "")).toMatch(/0,00.*€|€.*0,00/);
  });
});
