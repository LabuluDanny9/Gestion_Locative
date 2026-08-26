import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/auth-forms";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell>
      <Card className="border-primary/10 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Connexion</CardTitle>
          <CardDescription>
            Accédez uniquement avec le compte fourni par votre administrateur.
          </CardDescription>
        </CardHeader>
        <CardContent><LoginForm nextPath={next} /></CardContent>
      </Card>
      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
        L’inscription publique est désactivée pour protéger les comptes administratifs.
      </p>
    </AuthShell>
  );
}
