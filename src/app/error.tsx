"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-md text-center">
        <BrandMark className="mb-10 justify-center" />
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <TriangleAlert aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          L’opération n’a pas pu aboutir. Vous pouvez la relancer sans quitter cette page.
        </p>
        <Button className="mt-6" onClick={reset}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Réessayer
        </Button>
      </div>
    </main>
  );
}
