"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/feedback-state";

export default function NotificationsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return <AppShell><ErrorState description="Les notifications n’ont pas pu être chargées. Réessayez sans quitter votre session." onRetry={reset} title="Notifications indisponibles" /></AppShell>;
}
