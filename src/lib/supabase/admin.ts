import "server-only";

import { createClient } from "@supabase/supabase-js";

import { parseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

export function createAdminSupabaseClient() {
  const environment = parseServerEnv();
  if (!environment.NEXT_PUBLIC_SUPABASE_URL || !environment.SUPABASE_SECRET_KEY) {
    throw new Error("Configuration Supabase serveur manquante.");
  }
  return createClient<Database>(environment.NEXT_PUBLIC_SUPABASE_URL, environment.SUPABASE_SECRET_KEY, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
}
