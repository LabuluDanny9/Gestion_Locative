import "server-only";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/login");
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }

  return { supabase, user: data.user };
}
