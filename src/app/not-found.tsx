import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="max-w-md text-center">
        <BrandMark className="mb-10 justify-center" />
        <p className="font-mono text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold">Page introuvable</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Cette adresse n’existe pas ou la page a été déplacée.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Revenir à l’accueil
          </Link>
        </Button>
      </div>
    </main>
  );
}
