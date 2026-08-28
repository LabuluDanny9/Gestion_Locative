"use client";

import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, ImagePlus, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FormSection({ title, description, icon: Icon, children }: { title: string; description: string; icon: typeof Building2; children: ReactNode }) {
  return <Card><CardHeader><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><div><CardTitle>{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></div></div></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent></Card>;
}

export function PropertyFormPreview({ basePath, dashboardHref, action }: { basePath: string; dashboardHref: string; action?: (formData: FormData) => void | Promise<void> }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Aperçu du formulaire validé", { description: "Aucune donnée n’a été enregistrée pendant cette phase frontend." });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Propriétés", href: basePath }, { label: "Nouvelle propriété" }]} /><PageHeader description="Renseignez les informations générales et la structure initiale du patrimoine." eyebrow="Gestion locative" title="Ajouter une propriété" /></div>
      <Badge variant="secondary">{action ? "Enregistrement sécurisé dans Supabase" : "Prototype interactif · aucune donnée enregistrée"}</Badge>
      <form action={action} className="space-y-5" onSubmit={action ? undefined : handleSubmit}>
        <FormSection description="Identité principale visible dans tout le produit." icon={Building2} title="Informations générales">
          <div className="space-y-2"><Label htmlFor="property-name">Nom de la propriété</Label><Input id="property-name" name="name" placeholder="Ex. Résidence Grâce" required /></div>
          <div className="space-y-2"><Label htmlFor="property-type">Type</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="property-type" name="propertyType" required><option value="">Sélectionner</option><option value="building">Immeuble résidentiel</option><option value="house">Maison individuelle</option><option value="commercial">Immeuble mixte</option><option value="residence">Appartements meublés</option></select></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="property-description">Description</Label><Textarea id="property-description" name="description" placeholder="Décrivez brièvement la propriété et ses principaux atouts..." /></div>
        </FormSection>
        <FormSection description="Adresse utilisée sur les fiches, reçus et documents." icon={MapPin} title="Localisation">
          <div className="space-y-2"><Label htmlFor="property-city">Ville</Label><Input id="property-city" name="city" placeholder="Lubumbashi" required /></div>
          <div className="space-y-2"><Label htmlFor="property-country">Pays</Label><Input defaultValue="RDC" id="property-country" name="country" required /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="property-address">Adresse complète</Label><Input id="property-address" name="address" placeholder="Avenue, numéro, quartier" required /></div>
        </FormSection>
        <FormSection description="Préparez la hiérarchie bâtiments, étages et logements." icon={Building2} title="Structure initiale">
          <div className="space-y-2"><Label htmlFor="property-buildings">Nombre de bâtiments</Label><Input defaultValue="1" id="property-buildings" min="1" type="number" /></div>
          <div className="space-y-2"><Label htmlFor="property-floors">Nombre de niveaux</Label><Input defaultValue="1" id="property-floors" min="1" type="number" /></div>
          <div className="space-y-2"><Label htmlFor="property-currency">Devise principale</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="property-currency"><option>USD</option><option>CDF</option></select></div>
          <div className="space-y-2"><Label htmlFor="property-reference">Référence interne</Label><Input id="property-reference" name="code" placeholder="PROP-2026-001" /></div>
        </FormSection>
        <Card><CardContent className="flex min-h-36 flex-col items-center justify-center border-dashed p-6 text-center"><ImagePlus className="size-6 text-muted-foreground" /><p className="mt-3 text-sm font-medium">Photos et documents</p><p className="mt-1 text-xs text-muted-foreground">L’upload sera activé lors de l’intégration Supabase Storage.</p></CardContent></Card>
        <div className="sticky bottom-4 flex flex-col-reverse justify-end gap-2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row"><Button asChild variant="outline"><Link href={basePath}>Annuler</Link></Button><Button type="submit"><CheckCircle2 />{action ? "Créer la propriété" : "Valider l’aperçu"}</Button></div>
      </form>
    </div>
  );
}
