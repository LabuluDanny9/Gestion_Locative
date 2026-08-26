"use client";

import { RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="fr">
      <body className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
        <main className="max-w-md text-center">
          <h1 className="font-sans text-2xl font-semibold">L’application doit être relancée</h1>
          <p className="mt-3 text-muted-foreground">
            Une erreur inattendue a interrompu l’affichage de l’interface.
          </p>
          <button
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            onClick={reset}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Relancer
          </button>
        </main>
      </body>
    </html>
  );
}
