"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloudUpload, Save } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { TenantDocumentMetadata } from "@/services/rental-backend";

type CreateTenantResult = { ok: true; tenantId: string; organizationId: string } | { ok: false; message: string };
type FinalizeResult = { ok: true } | { ok: false; message: string };
type PrepareResult = { ok: true; uploads: { path: string; token: string }[] } | { ok: false; message: string };

export function TenantFormPreview({ basePath, dashboardHref, action, finalizeDocuments, prepareUploads, rollbackTenant }: { basePath: string; dashboardHref: string; action?: (formData: FormData) => Promise<CreateTenantResult>; finalizeDocuments?: (tenantId: string, documents: TenantDocumentMetadata[]) => Promise<FinalizeResult>; prepareUploads?: (tenantId: string, documents: Omit<TenantDocumentMetadata, "storagePath">[]) => Promise<PrepareResult>; rollbackTenant?: (tenantId: string, storagePaths: string[]) => Promise<void> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action || !finalizeDocuments || !prepareUploads || !rollbackTenant) {
      toast.success("Aperçu du dossier locataire validé", { description: "Aucune donnée n’a été enregistrée." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const files = formData.getAll("documents").filter((item): item is File => item instanceof File && item.size > 0);
    formData.delete("documents");
    const extensions: Record<TenantDocumentMetadata["mimeType"], string> = {
      "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png",
    };
    let tenantId: string | undefined;
    const uploadedPaths: string[] = [];
    const toastId = toast.loading("Création du locataire et envoi des documents…");
    setIsSubmitting(true);
    try {
      if (files.reduce((total, file) => total + file.size, 0) > 3 * 1024 * 1024) throw new Error("Le total des documents dépasse 3 Mo.");
      for (const file of files) {
        if (!(file.type in extensions)) throw new Error(`Document invalide : ${file.name}`);
      }
      const created = await action(formData);
      if (!created.ok) throw new Error(created.message);
      tenantId = created.tenantId;
      const requests = files.map((file) => ({ fileName: file.name, mimeType: file.type as TenantDocumentMetadata["mimeType"], fileSize: file.size }));
      const prepared = await prepareUploads(created.tenantId, requests);
      if (!prepared.ok) throw new Error(prepared.message);
      const supabase = createBrowserSupabaseClient();
      const metadata: TenantDocumentMetadata[] = [];
      for (const [index, file] of files.entries()) {
        const mimeType = file.type as TenantDocumentMetadata["mimeType"];
        const upload = prepared.uploads[index];
        if (!upload) throw new Error(`Préparation incomplète : ${file.name}`);
        const { error } = await supabase.storage.from("identity-documents").uploadToSignedUrl(upload.path, upload.token, file, { contentType: mimeType });
        if (error) throw error;
        uploadedPaths.push(upload.path);
        metadata.push({ storagePath: upload.path, fileName: file.name, mimeType, fileSize: file.size });
      }
      const finalized = await finalizeDocuments(created.tenantId, metadata);
      if (!finalized.ok) throw new Error(finalized.message);
      toast.success(files.length ? "Le locataire et ses documents ont été enregistrés." : "Le locataire a été enregistré.", { id: toastId });
      router.push(`${basePath}?creation=locataire`);
      router.refresh();
    } catch (cause) {
      if (tenantId) await rollbackTenant(tenantId, uploadedPaths).catch(() => undefined);
      toast.error(cause instanceof Error ? cause.message : "L’enregistrement du locataire a échoué.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Locataires", href: basePath }, { label: "Nouveau locataire" }]} /><PageHeader description="Créez un dossier complet avant de l’associer à un contrat de location." eyebrow="Nouveau dossier" title="Ajouter un locataire" /></div>
      <form className="mx-auto max-w-5xl space-y-5" onSubmit={handleSubmit}>
        <Card><CardHeader><CardTitle>Identité</CardTitle><CardDescription>Informations personnelles et pièce d’identité.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Field label="Nom complet" name="name" placeholder="Ex. Jean Kabulo" required /><Field label="Téléphone" name="phone" placeholder="+243 ..." required type="tel" /><Field label="Adresse email" name="email" placeholder="nom@email.com" required type="email" /><SelectField label="Type de pièce" name="identityType" options={["Passeport", "Carte d’électeur", "Permis de conduire", "Autre"]} /><Field label="Numéro de la pièce" name="identityNumber" placeholder="Numéro officiel" required /><Field label="Date d’expiration" name="identityExpiry" type="date" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Coordonnées</CardTitle><CardDescription>Adresse et personne à joindre en cas d’urgence.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Adresse actuelle</Label><Textarea id="address" name="address" placeholder="Commune, quartier, avenue et numéro" required /></div><Field label="Contact d’urgence" name="emergencyName" placeholder="Nom complet" required /><Field label="Téléphone du contact" name="emergencyPhone" placeholder="+243 ..." required type="tel" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Documents</CardTitle><CardDescription>{action ? "Les documents seront stockés dans un espace privé." : "Les fichiers seront reliés à Supabase Storage lors de la phase backend."}</CardDescription></CardHeader><CardContent><label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 p-6 text-center transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5"><CloudUpload aria-hidden="true" className="size-8 text-brand-blue" /><span className="mt-3 font-medium">Glissez vos fichiers ici ou cliquez pour parcourir</span><span className="mt-1 text-xs text-muted-foreground">PDF, JPG ou PNG · 3 Mo au total</span><Input accept=".pdf,.jpg,.jpeg,.png" className="sr-only" multiple name="documents" type="file" /></label></CardContent></Card>
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row"><Button asChild variant="outline"><Link href={basePath}>Annuler</Link></Button><Button disabled={isSubmitting} type="submit"><Save />{isSubmitting ? "Enregistrement…" : action ? "Créer le locataire" : "Valider l’aperçu"}</Button></div>
      </form>
    </div>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<typeof Input>) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} {...props} /></div>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id={name} name={name}>{options.map((option) => <option key={option}>{option}</option>)}</select></div>;
}
