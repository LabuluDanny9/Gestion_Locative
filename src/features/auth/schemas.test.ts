import { describe, expect, it } from "vitest";

import { loginSchema, updatePasswordSchema } from "./schemas";

describe("authentication schemas", () => {
  it("rejects malformed credentials before calling Supabase", () => {
    expect(loginSchema.safeParse({ email: "invalide", password: "court" }).success).toBe(false);
  });

  it("requires a strong matching password", () => {
    expect(
      updatePasswordSchema.safeParse({
        password: "MotDePasse2026",
        passwordConfirmation: "MotDePasse2026",
      }).success,
    ).toBe(true);
    expect(
      updatePasswordSchema.safeParse({
        password: "motdepasse",
        passwordConfirmation: "different",
      }).success,
    ).toBe(false);
  });
});
