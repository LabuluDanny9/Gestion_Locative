"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function ContractsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Les contrats n’ont pas pu être chargés. Vous pouvez réessayer sans quitter votre session." onRetry={reset} title="Contrats indisponibles" /></AppShell>;
}
