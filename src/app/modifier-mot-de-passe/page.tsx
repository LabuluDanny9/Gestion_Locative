import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/features/auth/auth-shell";
import { UpdatePasswordForm } from "@/features/auth/auth-forms";
import { requireUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Modifier le mot de passe" };

export default async function UpdatePasswordPage() {
  await requireUser();

  return (
    <AuthShell>
      <Card className="border-primary/10 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Nouveau mot de passe</CardTitle>
          <CardDescription>
            Choisissez un mot de passe long, unique et difficile à deviner.
          </CardDescription>
        </CardHeader>
        <CardContent><UpdatePasswordForm /></CardContent>
      </Card>
    </AuthShell>
  );
}
