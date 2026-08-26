import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/modifier-mot-de-passe";
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(url.searchParams.get("next"));
  const supabase = await createServerSupabaseClient();

  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("Lien incomplet") };

  if (!result.error) {
    url.pathname = next;
    url.search = "";
    return NextResponse.redirect(url);
  }

  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("erreur", "lien-invalide");
  return NextResponse.redirect(url);
}
