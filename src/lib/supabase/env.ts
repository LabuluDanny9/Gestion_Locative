import { z } from "zod";

export const publicSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
});

export type PublicSupabaseEnv = z.infer<typeof publicSupabaseEnvSchema>;

export function parsePublicSupabaseEnv(
  environment: Record<string, string | undefined>,
): PublicSupabaseEnv {
  return publicSupabaseEnvSchema.parse(environment);
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return parsePublicSupabaseEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
