import { describe, expect, it } from "vitest";

import { getDashboardData, parseDashboardPeriod } from "./dashboard-data";

describe("dashboard data", () => {
  it("falls back to the current month for an unknown period", () => {
    expect(parseDashboardPeriod("unknown")).toBe("month");
    expect(parseDashboardPeriod("quarter")).toBe("quarter");
  });

  it("starts empty when Supabase has no records", () => {
    const data = getDashboardData("quarter");
    expect(data.revenue).toHaveLength(0);
    expect(data.kpis.expected).toBe(0);
    expect(data.kpis.collected).toBe(0);
    expect(data.kpis.arrears).toBe(0);
    expect(data.kpis.recovery).toBe(0);
  });
});
