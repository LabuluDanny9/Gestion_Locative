import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { PropertyFormPreview } from "@/features/properties/property-form-preview";

export const metadata: Metadata = { title: "Ajouter une propriété" };

export default function NewPropertyPage() {
  return <ProtectedAppShell><PropertyFormPreview basePath="/proprietes" dashboardHref="/espace" /></ProtectedAppShell>;
}
