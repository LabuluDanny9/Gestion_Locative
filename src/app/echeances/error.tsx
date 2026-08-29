"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function InvoicesError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Les échéances n’ont pas pu être actualisées. Réessayez sans quitter votre session." onRetry={reset} title="Échéances indisponibles" /></AppShell>;
}
