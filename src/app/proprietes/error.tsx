"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function PropertiesError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Le patrimoine n’a pas pu être chargé. Vous pouvez réessayer sans quitter votre session." onRetry={reset} title="Propriétés indisponibles" /></AppShell>;
}
