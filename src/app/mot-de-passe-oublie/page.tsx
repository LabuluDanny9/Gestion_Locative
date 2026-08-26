import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/features/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/auth-forms";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <Card className="border-primary/10 shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Récupérer l’accès</CardTitle>
          <CardDescription>
            Nous enverrons un lien à usage limité si l’adresse correspond à un compte.
          </CardDescription>
        </CardHeader>
        <CardContent><ResetPasswordForm /></CardContent>
      </Card>
      <p className="mt-5 text-center text-sm">
        <Link className="font-medium text-primary hover:underline" href="/login">Retour à la connexion</Link>
      </p>
    </AuthShell>
  );
}
