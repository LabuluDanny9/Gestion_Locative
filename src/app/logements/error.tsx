"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function UnitsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Les logements n’ont pas pu être chargés. Vous pouvez relancer l’affichage." onRetry={reset} title="Logements indisponibles" /></AppShell>;
}
