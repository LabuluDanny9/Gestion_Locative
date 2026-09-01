"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function ArrearsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Les arriérés n’ont pas pu être actualisés. Réessayez sans quitter votre session." onRetry={reset} title="Arriérés indisponibles" /></AppShell>;
}
