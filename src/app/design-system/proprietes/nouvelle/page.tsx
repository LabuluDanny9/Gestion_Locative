import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { PropertyFormPreview } from "@/features/properties/property-form-preview";

export const metadata: Metadata = { title: "Aperçu création propriété" };

export default function NewPropertyPreviewPage() {
  return <AppShell displayName="Gestionnaire" preview previewHomeHref="/design-system/dashboard"><PropertyFormPreview basePath="/design-system/proprietes" dashboardHref="/design-system/dashboard" /></AppShell>;
}
