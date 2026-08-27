import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AccountShell } from "@/features/auth/account-shell";
import { requireUser } from "@/features/auth/server";
import { parseDashboardPeriod } from "@/features/dashboard/dashboard-data";
import { DashboardView } from "@/features/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string; debut?: string; fin?: string; "mot-de-passe"?: string }>;
}) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
  const displayName = profile?.display_name ?? undefined;

  return (
    <AccountShell displayName={displayName} email={user.email}>
      {params["mot-de-passe"] === "modifie" && (
        <Alert className="mb-6 border-status-paid/25 bg-status-paid/5">
          <CheckCircle2 aria-hidden="true" />
          <AlertTitle>Mot de passe modifié</AlertTitle>
          <AlertDescription>Votre nouveau mot de passe est maintenant actif.</AlertDescription>
        </Alert>
      )}
      <DashboardView
        basePath="/espace"
        displayName={displayName}
        endDate={params.fin}
        period={parseDashboardPeriod(params.periode)}
        startDate={params.debut}
      />
    </AccountShell>
  );
}
