import { describe, expect, it } from "vitest";

import { arrearsAgeBand } from "./arrears-data";

describe("arrearsAgeBand", () => {
  it.each([
    [1, "1-30"], [30, "1-30"], [31, "31-60"], [60, "31-60"],
    [61, "61-90"], [90, "61-90"], [91, "90+"],
  ] as const)("classe %s jours dans %s", (days, expected) => {
    expect(arrearsAgeBand(days)).toBe(expected);
  });
});
