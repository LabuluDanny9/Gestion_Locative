import type { Database } from "@/types/database.types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type AppPermission = Database["public"]["Enums"]["app_permission"];

export const roleLabels: Record<AppRole, string> = {
  super_admin: "Super administrateur",
  owner: "Propriétaire",
  manager: "Gestionnaire",
  cashier: "Caissier",
  tenant: "Locataire",
};

export const permissionLabels: Record<AppPermission, string> = {
  "organization.read": "Voir l’organisation",
  "organization.update": "Modifier l’organisation",
  "members.read": "Voir les membres",
  "members.manage": "Gérer les membres",
  "portfolio.read": "Voir le patrimoine",
  "portfolio.manage": "Gérer le patrimoine",
  "tenants.read": "Voir les locataires",
  "tenants.manage": "Gérer les locataires",
  "leases.read": "Voir les contrats",
  "leases.manage": "Gérer les contrats",
  "finance.read": "Voir les finances",
  "finance.manage": "Administrer les finances",
  "payments.create": "Enregistrer des paiements",
  "notifications.read": "Voir les notifications",
  "notifications.manage": "Gérer les notifications",
  "documents.read": "Voir les documents",
  "documents.manage": "Gérer les documents",
  "settings.read": "Voir les paramètres",
  "settings.manage": "Gérer les paramètres",
  "reports.read": "Voir les rapports",
  "audit.read": "Consulter l’audit",
  "portal.read": "Accéder au portail locataire",
  "maintenance.create": "Créer une demande d’intervention",
};

export function resolvePermissions(
  role: AppRole,
  defaults: Array<{ role: AppRole; permission: AppPermission }>,
  overrides: unknown,
) {
  const resolved = new Set(
    defaults.filter((item) => item.role === role).map((item) => item.permission),
  );

  if (overrides && typeof overrides === "object" && !Array.isArray(overrides)) {
    for (const [key, value] of Object.entries(overrides)) {
      if (key in permissionLabels && typeof value === "boolean") {
        if (value) resolved.add(key as AppPermission);
        else resolved.delete(key as AppPermission);
      }
    }
  }

  return [...resolved].sort();
}
