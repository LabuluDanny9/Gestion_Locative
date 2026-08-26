import { describe, expect, it } from "vitest";

import { parseServerEnv } from "./env";

describe("parseServerEnv", () => {
  it("applique les valeurs metier par defaut sans exiger les secrets en Phase 1", () => {
    const environment = parseServerEnv({});

    expect(environment.APP_TIMEZONE).toBe("Africa/Lubumbashi");
    expect(environment.DEFAULT_CURRENCY).toBe("USD");
    expect(environment.SUPABASE_SECRET_KEY).toBeUndefined();
  });

  it("refuse une URL publique invalide", () => {
    expect(() =>
      parseServerEnv({ NEXT_PUBLIC_SUPABASE_URL: "supabase-invalide" }),
    ).toThrow();
  });
});
