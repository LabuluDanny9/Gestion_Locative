import type { Metadata } from "next";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountShell } from "@/features/auth/account-shell";
import { ProfileForm } from "@/features/auth/auth-forms";
import { requireUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Mon profil" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, first_name, last_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <AccountShell email={user.email}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Mon profil</h1>
          <p className="mt-2 text-muted-foreground">
            Ces informations sont visibles uniquement par vous et les membres autorisés de vos organisations.
          </p>
        </div>
        {error || !profile ? (
          <Alert variant="destructive">
            <AlertTitle>Profil indisponible</AlertTitle>
            <AlertDescription>Le profil n’a pas pu être chargé. Contactez un administrateur.</AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Informations personnelles</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent><ProfileForm profile={profile} /></CardContent>
          </Card>
        )}
      </div>
    </AccountShell>
  );
}
