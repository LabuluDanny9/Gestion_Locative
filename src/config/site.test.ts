import { describe, expect, it } from "vitest";

import { siteConfig } from "./site";

describe("siteConfig", () => {
  it("uses the official application brand", () => {
    expect(siteConfig.name).toBe("AMIRANDA EMPIRE");
    expect(siteConfig.shortName).toBe("AE");
  });

  it("conserve les devises et le fuseau horaire de reference", () => {
    expect(siteConfig.currencies).toEqual(["USD", "CDF"]);
    expect(siteConfig.timezone).toBe("Africa/Lubumbashi");
  });
});
