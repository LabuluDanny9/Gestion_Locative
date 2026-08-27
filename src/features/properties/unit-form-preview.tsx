"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, House, Images, Ruler, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { properties } from "./property-data";
import { UnitPhotoUploader } from "./unit-photo-uploader";

export function UnitFormPreview({ basePath, dashboardHref, defaultProperty }: { basePath: string; dashboardHref: string; defaultProperty?: string }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Aperçu du logement validé", { description: "L’enregistrement réel sera relié à Supabase après finalisation du frontend." });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Logements", href: basePath }, { label: "Nouveau logement" }]} /><PageHeader description="Définissez le rattachement, les caractéristiques et les conditions locatives." eyebrow="Aperçu frontend" title="Ajouter un logement" /></div>
      <Badge variant="secondary">Prototype interactif · aucune donnée enregistrée</Badge>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><House className="text-brand-blue" />Identification</CardTitle><CardDescription>Rattachement du logement dans le patrimoine.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label htmlFor="unit-property">Propriété</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" defaultValue={defaultProperty ?? ""} id="unit-property" required><option value="">Sélectionner une propriété</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></div><div className="space-y-2"><Label htmlFor="unit-code">Code du logement</Label><Input id="unit-code" placeholder="A03" required /></div><div className="space-y-2"><Label htmlFor="unit-type">Type</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="unit-type" required><option>Appartement</option><option>Studio</option><option>Maison</option><option>Local commercial</option></select></div><div className="space-y-2"><Label htmlFor="unit-building">Bâtiment</Label><Input id="unit-building" placeholder="Bâtiment A" /></div><div className="space-y-2"><Label htmlFor="unit-floor">Étage</Label><Input id="unit-floor" placeholder="2e étage" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Ruler className="text-brand-blue" />Caractéristiques</CardTitle><CardDescription>Configuration physique de l’unité.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="unit-bedrooms">Chambres</Label><Input defaultValue="1" id="unit-bedrooms" min="0" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-living">Salons</Label><Input defaultValue="1" id="unit-living" min="0" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-bathrooms">Salles de bain</Label><Input defaultValue="1" id="unit-bathrooms" min="0" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-kitchens">Cuisines</Label><Input defaultValue="1" id="unit-kitchens" min="0" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-area">Superficie (m²)</Label><Input id="unit-area" min="0" placeholder="82" type="number" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Images className="text-brand-blue" />Galerie du logement</CardTitle><CardDescription>Présentez chaque pièce pour offrir une visite visuelle complète, quel que soit le type de logement.</CardDescription></CardHeader><CardContent><UnitPhotoUploader /></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="text-brand-blue" />Conditions locatives</CardTitle><CardDescription>Loyer de référence et disponibilité initiale.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="unit-rent">Loyer mensuel</Label><Input id="unit-rent" min="0" placeholder="350" required type="number" /></div><div className="space-y-2"><Label htmlFor="unit-currency">Devise</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="unit-currency"><option>USD</option><option>CDF</option></select></div><div className="space-y-2"><Label htmlFor="unit-status">Statut initial</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="unit-status"><option value="available">Libre</option><option value="reserved">Réservé</option><option value="maintenance">Maintenance</option></select></div></CardContent></Card>
        <div className="sticky bottom-4 flex flex-col-reverse justify-end gap-2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row"><Button asChild variant="outline"><Link href={basePath}>Annuler</Link></Button><Button type="submit"><CheckCircle2 />Valider l’aperçu</Button></div>
      </form>
    </div>
  );
}
