import type { Database } from "@/types/database.types";

export type DocumentKind = Database["public"]["Enums"]["document_kind"];
export type DocumentFilters = { query: string; kind?: DocumentKind; link?: "organization" | "property" | "tenant" | "lease" };

export const documentKindLabels: Record<DocumentKind, string> = {
  tenant_photo: "Photo du locataire",
  property_image: "Image du logement",
  identity_document: "Pièce d’identité",
  lease_document: "Document du contrat",
  receipt: "Reçu",
  expense_proof: "Justificatif de dépense",
  maintenance_attachment: "Pièce de maintenance",
  other: "Autre document",
};

const kinds = new Set<DocumentKind>(Object.keys(documentKindLabels) as DocumentKind[]);

export function parseDocumentFilters(input: { q?: string; type?: string; lien?: string }): DocumentFilters {
  const link = ["organization", "property", "tenant", "lease"].includes(input.lien ?? "")
    ? input.lien as DocumentFilters["link"]
    : undefined;
  return {
    query: (input.q ?? "").trim().slice(0, 100),
    kind: kinds.has(input.type as DocumentKind) ? input.type as DocumentKind : undefined,
    link,
  };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}
