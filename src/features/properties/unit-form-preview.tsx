"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, House, Images, Ruler, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { UnitPhotoMetadata } from "@/services/rental-backend";

import { UnitPhotoUploader } from "./unit-photo-uploader";

type PropertyOption = { id: string; name: string };
type CreateUnitResult = { ok: true; unitId: string; organizationId: string } | { ok: false; message: string };
type FinalizeResult = { ok: true } | { ok: false; message: string };

export function UnitFormPreview({ basePath, dashboardHref, defaultProperty, action, finalizePhotos, rollbackUnit, propertyOptions = [] }: { basePath: string; dashboardHref: string; defaultProperty?: string; action?: (formData: FormData) => Promise<CreateUnitResult>; finalizePhotos?: (unitId: string, photos: UnitPhotoMetadata[]) => Promise<FinalizeResult>; rollbackUnit?: (unitId: string, storagePaths: string[]) => Promise<void>; propertyOptions?: PropertyOption[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action || !finalizePhotos || !rollbackUnit) {
      toast.success("Aperçu du logement validé", { description: "L’enregistrement réel sera relié à Supabase après finalisation du frontend." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const files = formData.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
    formData.delete("photos");
    let unitId: string | undefined;
    const uploadedPaths: string[] = [];
    const toastId = toast.loading("Création du logement et envoi des photos…");
    setIsSubmitting(true);
    try {
      const created = await action(formData);
      if (!created.ok) throw new Error(created.message);
      unitId = created.unitId;
      const supabase = createBrowserSupabaseClient();
      const metadata: UnitPhotoMetadata[] = [];
      const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
      for (const file of files) {
        if (!(file.type in extensions) || file.size > 6 * 1024 * 1024) throw new Error(`Photo invalide : ${file.name}`);
        const mimeType = file.type as UnitPhotoMetadata["mimeType"];
        const path = `${created.organizationId}/units/${created.unitId}/${crypto.randomUUID()}.${extensions[mimeType]}`;
        const { error } = await supabase.storage.from("property-images").upload(path, file, { contentType: mimeType, upsert: false });
        if (error) throw error;
        uploadedPaths.push(path);
        metadata.push({ storagePath: path, fileName: file.name, mimeType, fileSize: file.size });
      }
      const finalized = await finalizePhotos(created.unitId, metadata);
      if (!finalized.ok) throw new Error(finalized.message);
      toast.success("Le logement et ses photos ont été enregistrés.", { id: toastId });
      router.push(`${basePath}?creation=logement`);
      router.refresh();
    } catch (cause) {
      if (unitId) await rollbackUnit(unitId, uploadedPaths).catch(() => undefined);
      toast.error(cause instanceof Error ? cause.message : "L’enregistrement a échoué.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Logements", href: basePath }, { label: "Nouveau logement" }]} /><PageHeader description="Définissez le rattachement, les caractéristiques et les conditions locatives." eyebrow="Gestion locative" title="Ajouter un logement" /></div>
      <Badge variant="secondary">{action ? "Enregistrement sécurisé dans Supabase" : "Prototype interactif · aucune donnée enregistrée"}</Badge>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><House className="text-brand-blue" />Identification</CardTitle><CardDescription>Rattachement du logement dans le patrimoine.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2 sm:col-span-2"><Label htmlFor="unit-property">Propriété</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" defaultValue={defaultProperty ?? ""} id="unit-property" name="propertyId" required><option value="">Sélectionner une propriété</option>{propertyOptions.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select></div><div className="space-y-2"><Label htmlFor="unit-code">Code du logement</Label><Input id="unit-code" name="code" placeholder="A03" required /></div><div className="space-y-2"><Label htmlFor="unit-type">Type</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="unit-type" name="unitType" required><option value="apartment">Appartement</option><option value="studio">Studio</option><option value="house">Maison</option><option value="shop">Local commercial</option></select></div><div className="space-y-2"><Label htmlFor="unit-building">Bâtiment</Label><Input id="unit-building" placeholder="Bâtiment A" /></div><div className="space-y-2"><Label htmlFor="unit-floor">Étage</Label><Input id="unit-floor" placeholder="2e étage" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Ruler className="text-brand-blue" />Caractéristiques</CardTitle><CardDescription>Configuration physique de l’unité.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="unit-bedrooms">Chambres</Label><Input defaultValue="1" id="unit-bedrooms" min="0" name="bedrooms" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-living">Salons</Label><Input defaultValue="1" id="unit-living" min="0" name="livingRooms" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-bathrooms">Salles de bain</Label><Input defaultValue="1" id="unit-bathrooms" min="0" name="bathrooms" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-kitchens">Cuisines</Label><Input defaultValue="1" id="unit-kitchens" min="0" name="kitchens" type="number" /></div><div className="space-y-2"><Label htmlFor="unit-area">Superficie (m²)</Label><Input id="unit-area" min="0" name="area" placeholder="82" type="number" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Images className="text-brand-blue" />Galerie du logement</CardTitle><CardDescription>Présentez chaque pièce pour offrir une visite visuelle complète, quel que soit le type de logement.</CardDescription></CardHeader><CardContent><UnitPhotoUploader /></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="text-brand-blue" />Conditions locatives</CardTitle><CardDescription>Loyer de référence et disponibilité initiale.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="unit-rent">Loyer mensuel</Label><Input id="unit-rent" min="0" name="rent" placeholder="350" required type="number" /></div><div className="space-y-2"><Label htmlFor="unit-currency">Devise</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="unit-currency" name="currency"><option>USD</option><option>CDF</option></select></div><div className="space-y-2"><Label htmlFor="unit-status">Statut initial</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id="unit-status" name="status"><option value="available">Libre</option><option value="reserved">Réservé</option><option value="maintenance">Maintenance</option></select></div></CardContent></Card>
        <div className="sticky bottom-4 flex flex-col-reverse justify-end gap-2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row"><Button asChild variant="outline"><Link href={basePath}>Annuler</Link></Button><Button disabled={isSubmitting} type="submit"><CheckCircle2 />{isSubmitting ? "Enregistrement…" : action ? "Créer le logement" : "Valider l’aperçu"}</Button></div>
      </form>
    </div>
  );
}
