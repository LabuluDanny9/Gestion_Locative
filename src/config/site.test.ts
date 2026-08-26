import { describe, expect, it } from "vitest";

import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("conserve les devises et le fuseau horaire de reference", () => {
    expect(siteConfig.currencies).toEqual(["USD", "CDF"]);
    expect(siteConfig.timezone).toBe("Africa/Lubumbashi");
  });
});
