import { describe, expect, it } from "vitest";

import { getDashboardData, parseDashboardPeriod } from "./dashboard-data";

describe("dashboard data", () => {
  it("falls back to the current month for an unknown period", () => {
    expect(parseDashboardPeriod("unknown")).toBe("month");
    expect(parseDashboardPeriod("quarter")).toBe("quarter");
  });

  it("keeps the KPI totals consistent with the chart points", () => {
    const data = getDashboardData("quarter");
    const expected = data.revenue.reduce((total, point) => total + point.expected, 0);
    const collected = data.revenue.reduce((total, point) => total + point.collected, 0);

    expect(data.revenue).toHaveLength(3);
    expect(data.kpis.expected).toBe(expected);
    expect(data.kpis.collected).toBe(collected);
    expect(data.kpis.arrears).toBe(expected - collected);
    expect(data.kpis.recovery).toBeCloseTo((collected / expected) * 100);
  });
});
