import { describe, expect, it } from "vitest";

import { buildLeaseCreationRpc } from "./lease-creation";

describe("buildLeaseCreationRpc", () => {
  it("uses the established RPC with every parameter explicitly supplied", async () => {
    const request = buildLeaseCreationRpc("8be80885-a435-45ac-bfa5-e0b207b435cb", {
      tenantId: "79eff5ae-5945-413c-b24d-85df7e568db5",
      unitId: "f5593364-6a24-4b90-83d5-b4050efc2a87",
      startDate: "2026-08-31",
      endDate: null,
      rent: 500,
      currency: "USD",
      guarantee: 500,
      frequency: "monthly",
      dueDay: 5,
      terms: undefined,
    });

    expect(request).toEqual({
      p_organization_id: "8be80885-a435-45ac-bfa5-e0b207b435cb",
      p_tenant_id: "79eff5ae-5945-413c-b24d-85df7e568db5",
      p_unit_id: "f5593364-6a24-4b90-83d5-b4050efc2a87",
      p_start_date: "2026-08-31",
      p_end_date: null,
      p_rent_amount: 500,
      p_currency: "USD",
      p_guarantee_amount: 500,
      p_advance_amount: 0,
      p_frequency: "monthly",
      p_due_day: 5,
      p_terms: "",
    });
  });
});
