import { describe, expect, it } from "vitest";

import { getProperty, getPropertyUnits, getUnit } from "./property-data";

describe("property demo data", () => {
  it("resolves property and unit detail routes", () => {
    expect(getProperty("residence-grace")?.name).toBe("Résidence Grâce");
    expect(getUnit("appartement-a03")?.code).toBe("A03");
  });

  it("keeps units scoped to their property", () => {
    expect(getPropertyUnits("residence-grace")).toHaveLength(4);
    expect(getPropertyUnits("residence-grace").every((unit) => unit.propertyId === "residence-grace")).toBe(true);
  });
});
