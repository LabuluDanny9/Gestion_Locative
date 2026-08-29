"use client";

import Link from "next/link";
import { CloudUpload, Save } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { PendingSubmitButton } from "@/components/shared/pending-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TenantFormPreview({ basePath, dashboardHref, action }: { basePath: string; dashboardHref: string; action?: (formData: FormData) => void | Promise<void> }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Aperçu du dossier locataire validé", { description: "Aucune donnée n’a été enregistrée. La persistance sera ajoutée avec le backend." });
  }

  return (
    <div className="space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Locataires", href: basePath }, { label: "Nouveau locataire" }]} /><PageHeader description="Créez un dossier complet avant de l’associer à un contrat de location." eyebrow="Nouveau dossier" title="Ajouter un locataire" /></div>
      <form action={action} className="mx-auto max-w-5xl space-y-5" onSubmit={action ? undefined : handleSubmit}>
        <Card><CardHeader><CardTitle>Identité</CardTitle><CardDescription>Informations personnelles et pièce d’identité.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Field label="Nom complet" name="name" placeholder="Ex. Jean Kabulo" required /><Field label="Téléphone" name="phone" placeholder="+243 ..." required type="tel" /><Field label="Adresse email" name="email" placeholder="nom@email.com" required type="email" /><SelectField label="Type de pièce" name="identityType" options={["Passeport", "Carte d’électeur", "Permis de conduire", "Autre"]} /><Field label="Numéro de la pièce" name="identityNumber" placeholder="Numéro officiel" required /><Field label="Date d’expiration" name="identityExpiry" type="date" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Coordonnées</CardTitle><CardDescription>Adresse et personne à joindre en cas d’urgence.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Adresse actuelle</Label><Textarea id="address" name="address" placeholder="Commune, quartier, avenue et numéro" required /></div><Field label="Contact d’urgence" name="emergencyName" placeholder="Nom complet" required /><Field label="Téléphone du contact" name="emergencyPhone" placeholder="+243 ..." required type="tel" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Documents</CardTitle><CardDescription>{action ? "Les documents seront stockés dans un espace privé." : "Les fichiers seront reliés à Supabase Storage lors de la phase backend."}</CardDescription></CardHeader><CardContent><label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 p-6 text-center transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5"><CloudUpload aria-hidden="true" className="size-8 text-brand-blue" /><span className="mt-3 font-medium">Glissez vos fichiers ici ou cliquez pour parcourir</span><span className="mt-1 text-xs text-muted-foreground">PDF, JPG ou PNG · 3 Mo au total</span><Input accept=".pdf,.jpg,.jpeg,.png" className="sr-only" multiple name="documents" type="file" /></label></CardContent></Card>
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row"><Button asChild variant="outline"><Link href={basePath}>Annuler</Link></Button>{action ? <PendingSubmitButton idleLabel="Créer le locataire" pendingLabel="Création en cours…" /> : <Button type="submit"><Save />Valider l’aperçu</Button>}</div>
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
