import { describe, expect, it } from "vitest";

import { contracts, getContract } from "./contract-data";

describe("contract demo data", () => {
  it("uses unique references and routes", () => {
    expect(new Set(contracts.map((contract) => contract.reference)).size).toBe(contracts.length);
    expect(getContract("ctr-2026-0042")?.tenantId).toBe("jean-kabulo");
  });

  it("keeps financial amounts explicit", () => {
    expect(contracts.every((contract) => contract.rent > 0 && contract.guarantee >= 0)).toBe(true);
  });
});
