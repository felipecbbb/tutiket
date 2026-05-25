import { describe, it, expect } from "vitest";
import { parseBulkGuestText } from "@/lib/validations/guest";

describe("parseBulkGuestText", () => {
  it("parsea CSV con coma", () => {
    const result = parseBulkGuestText("María, maria@a.com, si\nJuan, juan@b.com");
    expect(result).toEqual([
      { name: "María", email: "maria@a.com", prepaid: true },
      { name: "Juan", email: "juan@b.com", prepaid: false },
    ]);
  });

  it("acepta tab y punto-y-coma como separadores", () => {
    const result = parseBulkGuestText("Ana\tana@x.com\tno\nBea;bea@y.com;1");
    expect(result[0].name).toBe("Ana");
    expect(result[0].email).toBe("ana@x.com");
    expect(result[1].prepaid).toBe(true);
  });

  it("acepta solo nombre (email opcional)", () => {
    const result = parseBulkGuestText("Carlos\nDani López");
    expect(result).toEqual([
      { name: "Carlos", email: "", prepaid: false },
      { name: "Dani López", email: "", prepaid: false },
    ]);
  });

  it("ignora líneas vacías", () => {
    const result = parseBulkGuestText("\n\nElena\n\n");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Elena");
  });

  it("acepta sí/yes/true/1 como prepaid", () => {
    const tests = ["X,a@b.com,sí", "X,a@b.com,yes", "X,a@b.com,TRUE", "X,a@b.com,1"];
    for (const t of tests) {
      expect(parseBulkGuestText(t)[0].prepaid).toBe(true);
    }
  });
});
