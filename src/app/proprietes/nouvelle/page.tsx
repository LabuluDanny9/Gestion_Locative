import type { Metadata } from "next";

import { ProtectedAppShell } from "@/features/auth/protected-app-shell";
import { createPropertyAction } from "@/features/backend/actions";
import { PropertyFormPreview } from "@/features/properties/property-form-preview";

export const metadata: Metadata = { title: "Ajouter une propriété" };

export default function NewPropertyPage() {
  return <ProtectedAppShell><PropertyFormPreview action={createPropertyAction} basePath="/proprietes" dashboardHref="/espace" /></ProtectedAppShell>;
}
