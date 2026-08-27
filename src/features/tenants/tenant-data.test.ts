import { describe, expect, it } from "vitest";

import { getTenant, getTenantByCode, tenants } from "./tenant-data";

describe("tenant demo data", () => {
  it("exposes unique, routable tenant identifiers", () => {
    expect(new Set(tenants.map((tenant) => tenant.id)).size).toBe(tenants.length);
    expect(getTenant("jean-kabulo")?.unitId).toBe("appartement-a03");
  });

  it("links unit occupants to tenant records", () => {
    expect(getTenantByCode("LOC-2026-0018")?.name).toBe("Locataire Démo 02");
    expect(getTenantByCode("UNKNOWN")).toBeUndefined();
  });
});
