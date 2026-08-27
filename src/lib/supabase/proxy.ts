import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database.types";

import { getPublicSupabaseEnv } from "./env";

const protectedPaths = ["/espace", "/profil", "/organisation", "/proprietes", "/logements"];
const guestOnlyPaths = ["/login", "/mot-de-passe-oublie"];

function matches(pathname: string, roots: string[]) {
  return roots.some((root) => pathname === root || pathname.startsWith(`${root}/`));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const environment = getPublicSupabaseEnv();

  const supabase = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, responseHeaders) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          response = NextResponse.next({ request });

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }

          for (const [name, value] of Object.entries(responseHeaders)) {
            response.headers.set(name, value);
          }
        },
      },
    },
  );

  // getClaims verifies the JWT and refreshes cookie-backed sessions when needed.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);
  const pathname = request.nextUrl.pathname;

  if (!isAuthenticated && matches(pathname, protectedPaths)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && matches(pathname, guestOnlyPaths)) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = "/espace";
    appUrl.search = "";
    return NextResponse.redirect(appUrl);
  }

  return response;
}
