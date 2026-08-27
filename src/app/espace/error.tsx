"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell>
      <ErrorState
        description="Le tableau de bord n’a pas pu être chargé. Votre session reste active et vous pouvez relancer l’affichage."
        onRetry={reset}
        title="Dashboard momentanément indisponible"
      />
    </AppShell>
  );
}
