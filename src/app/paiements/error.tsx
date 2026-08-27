"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function PaymentsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Les paiements n’ont pas pu être chargés. Vous pouvez réessayer sans quitter votre session." onRetry={reset} title="Paiements indisponibles" /></AppShell>;
}
