import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-background grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden border-r bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <BrandMark className="[&_span]:text-primary-foreground" />
        <div className="max-w-lg">
          <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-white/10">
            <ShieldCheck aria-hidden="true" className="size-6" />
          </span>
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em]">
            Vos données locatives restent strictement cloisonnées.
          </h1>
          <p className="mt-5 text-base leading-7 text-primary-foreground/75">
            Chaque session est vérifiée côté serveur et chaque requête est limitée par
            l’organisation, le rôle et les permissions de l’utilisateur.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">Authentification sécurisée par Supabase</p>
      </section>

      <section className="flex min-h-screen flex-col">
        <header className="flex h-18 items-center justify-between border-b px-5 sm:px-8">
          <Link className="lg:hidden" href="/" aria-label="Retour à l’accueil">
            <BrandMark />
          </Link>
          <span className="hidden text-sm text-muted-foreground lg:block">Accès professionnel</span>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </section>
    </main>
  );
}
