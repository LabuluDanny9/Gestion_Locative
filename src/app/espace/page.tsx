import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CheckCircle2, KeyRound, ShieldCheck, UsersRound } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountShell } from "@/features/auth/account-shell";
import {
  permissionLabels,
  resolvePermissions,
  roleLabels,
  type AppPermission,
  type AppRole,
} from "@/features/auth/permissions";
import { requireUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Espace sécurisé" };
export const dynamic = "force-dynamic";

export default async function SecureSpacePage({
  searchParams,
}: {
  searchParams: Promise<{ "mot-de-passe"?: string }>;
}) {
  const { "mot-de-passe": passwordState } = await searchParams;
  const { supabase, user } = await requireUser();

  const [profileResult, membershipsResult, permissionsResult] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("organization_members")
      .select(
        "id, organization_id, role, status, permissions, organizations(id, name, code, status, default_currency, timezone)",
      )
      .eq("user_id", user.id)
      .eq("status", "active"),
    supabase.from("role_permissions").select("role, permission"),
  ]);

  const memberships = membershipsResult.data ?? [];
  const permissionDefaults = (permissionsResult.data ?? []) as Array<{
    role: AppRole;
    permission: AppPermission;
  }>;

  return (
    <AccountShell displayName={profileResult.data?.display_name ?? undefined} email={user.email}>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="mb-3 rounded-full" variant="secondary">Phase 3 · Accès sécurisé</Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Bonjour {profileResult.data?.display_name ?? ""}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Votre session, vos organisations et vos permissions sont vérifiées par Supabase et PostgreSQL.
          </p>
        </div>
        <Button asChild variant="outline"><Link href="/profil">Modifier mon profil</Link></Button>
      </div>

      {passwordState === "modifie" && (
        <Alert className="mb-6 border-status-paid/25 bg-status-paid/5">
          <CheckCircle2 aria-hidden="true" />
          <AlertTitle>Mot de passe modifié</AlertTitle>
          <AlertDescription>Votre nouveau mot de passe est maintenant actif.</AlertDescription>
        </Alert>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><ShieldCheck className="size-5 text-primary" /><CardTitle className="text-base">Session vérifiée</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Jeton contrôlé côté serveur, cookies synchronisés.</CardContent>
        </Card>
        <Card>
          <CardHeader><Building2 className="size-5 text-primary" /><CardTitle className="text-base">Isolation organisationnelle</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Aucune donnée d’une autre organisation ne peut traverser la RLS.</CardContent>
        </Card>
        <Card>
          <CardHeader><KeyRound className="size-5 text-primary" /><CardTitle className="text-base">Permissions minimales</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Chaque rôle reçoit uniquement les actions nécessaires.</CardContent>
        </Card>
      </div>

      {memberships.length === 0 ? (
        <EmptyState
          description="Le compte est authentifié, mais aucun accès actif ne lui a encore été attribué. Un propriétaire doit l’ajouter à une organisation."
          icon={UsersRound}
          title="Aucune organisation active"
        />
      ) : (
        <section aria-labelledby="organizations-title">
          <div className="mb-4">
            <h2 className="font-heading text-xl font-semibold" id="organizations-title">Mes accès</h2>
            <p className="mt-1 text-sm text-muted-foreground">Droits réellement chargés depuis la base.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {memberships.map((membership) => {
              const organization = Array.isArray(membership.organizations)
                ? membership.organizations[0]
                : membership.organizations;
              const permissions = resolvePermissions(
                membership.role as AppRole,
                permissionDefaults,
                membership.permissions,
              );

              return (
                <Card key={membership.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-heading">{organization?.name ?? "Organisation"}</CardTitle>
                        <CardDescription className="mt-1">{organization?.code}</CardDescription>
                      </div>
                      <Badge>{roleLabels[membership.role as AppRole]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {permissions.length} permissions effectives
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {permissions.slice(0, 8).map((permission) => (
                        <Badge key={permission} variant="outline">{permissionLabels[permission]}</Badge>
                      ))}
                      {permissions.length > 8 && <Badge variant="secondary">+{permissions.length - 8}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </AccountShell>
  );
}
