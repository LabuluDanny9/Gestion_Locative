import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { TenantFormPreview } from "@/features/tenants/tenant-form-preview";

export const metadata: Metadata = { title: "Aperçu nouveau locataire" };

export default function NewTenantPreviewPage() {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><TenantFormPreview basePath="/design-system/locataires" dashboardHref="/design-system/dashboard" /></AppShell>;
}
