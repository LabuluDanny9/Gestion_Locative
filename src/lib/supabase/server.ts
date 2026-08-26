import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database.types";

import { getPublicSupabaseEnv } from "./env";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const environment = getPublicSupabaseEnv();

  return createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot write cookies. The authentication proxy
            // introduced in Phase 3 will refresh sessions and copy cache headers.
          }
        },
      },
    },
  );
}
