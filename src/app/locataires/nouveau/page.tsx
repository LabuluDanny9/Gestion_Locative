import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { createTenantAction } from "@/features/backend/actions";
import { TenantFormPreview } from "@/features/tenants/tenant-form-preview";

export const metadata: Metadata = { title: "Nouveau locataire" };

export default function NewTenantPage() {
  return <ProtectedAppShell><TenantFormPreview action={createTenantAction} basePath="/locataires" dashboardHref="/espace" /></ProtectedAppShell>;
}
