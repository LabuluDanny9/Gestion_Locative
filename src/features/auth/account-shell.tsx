import Link from "next/link";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

import { logoutAction } from "./actions";

export function AccountShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string;
}) {
  return (
    <main className="app-background min-h-screen">
      <header className="border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/espace" aria-label="Accéder à l’espace sécurisé">
            <BrandMark />
          </Link>
          <nav aria-label="Espace sécurisé" className="order-3 flex w-full gap-1 sm:order-2 sm:w-auto">
            <Button asChild variant="ghost">
              <Link href="/espace"><ShieldCheck aria-hidden="true" />Accès</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/profil"><UserRound aria-hidden="true" />Profil</Link>
            </Button>
          </nav>
          <div className="order-2 flex items-center gap-2 sm:order-3">
            {email && <span className="hidden max-w-48 truncate text-xs text-muted-foreground lg:block">{email}</span>}
            <ThemeToggle />
            <form action={logoutAction}>
              <Button aria-label="Se déconnecter" size="icon" type="submit" variant="outline">
                <LogOut aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">{children}</div>
    </main>
  );
}
