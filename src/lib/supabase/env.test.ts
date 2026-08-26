import { describe, expect, it } from "vitest";

import { parsePublicSupabaseEnv } from "./env";

describe("parsePublicSupabaseEnv", () => {
  it("accepte une configuration publique complète", () => {
    const environment = parsePublicSupabaseEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        "sb_publishable_example-key-long-enough",
    });

    expect(environment.NEXT_PUBLIC_SUPABASE_URL).toBe(
      "https://project-ref.supabase.co",
    );
  });

  it("refuse une configuration incomplète", () => {
    expect(() => parsePublicSupabaseEnv({})).toThrow();
  });
});
