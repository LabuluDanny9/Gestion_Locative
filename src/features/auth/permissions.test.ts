import { describe, expect, it } from "vitest";

import { resolvePermissions, type AppPermission, type AppRole } from "./permissions";

const defaults: Array<{ role: AppRole; permission: AppPermission }> = [
  { role: "manager", permission: "portfolio.read" },
  { role: "manager", permission: "portfolio.manage" },
  { role: "cashier", permission: "payments.create" },
];

describe("resolvePermissions", () => {
  it("loads role defaults", () => {
    expect(resolvePermissions("cashier", defaults, {})).toEqual(["payments.create"]);
  });

  it("applies only boolean overrides for known permissions", () => {
    expect(
      resolvePermissions("manager", defaults, {
        "portfolio.read": false,
        "finance.read": true,
        invalid: true,
        "members.manage": "true",
      }),
    ).toEqual(["finance.read", "portfolio.manage"]);
  });
});
