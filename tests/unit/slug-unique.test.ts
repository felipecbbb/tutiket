import { describe, it, expect } from "vitest";
import { uniqueSlug } from "@/server/slug";

describe("uniqueSlug", () => {
  it("devuelve el slug base si no existe", async () => {
    const existing = new Set<string>();
    const result = await uniqueSlug("Sala Berlin", async (s) => existing.has(s));
    expect(result).toBe("sala-berlin");
  });

  it("añade -2 si el base ya existe", async () => {
    const taken = new Set(["sala-berlin"]);
    const result = await uniqueSlug("Sala Berlin", async (s) => taken.has(s));
    expect(result).toBe("sala-berlin-2");
  });

  it("salta hasta el primer libre", async () => {
    const taken = new Set([
      "sala-berlin",
      "sala-berlin-2",
      "sala-berlin-3",
      "sala-berlin-4",
    ]);
    const result = await uniqueSlug("Sala Berlin", async (s) => taken.has(s));
    expect(result).toBe("sala-berlin-5");
  });

  it("falla si el nombre no produce slug válido", async () => {
    await expect(uniqueSlug("###", async () => false)).rejects.toThrow();
  });
});
