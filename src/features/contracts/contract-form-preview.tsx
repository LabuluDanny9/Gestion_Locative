"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, House, ShieldCheck, UploadCloud, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const steps: { label: string; icon: LucideIcon }[] = [
  { label: "Locataire", icon: UserRound }, { label: "Logement", icon: House }, { label: "Conditions", icon: FileText }, { label: "Garantie", icon: ShieldCheck }, { label: "Documents", icon: UploadCloud }, { label: "Vérification", icon: CheckCircle2 },
];

type TenantOption = { id: string; name: string; phone: string };
type UnitOption = { id: string; type: string; code: string; propertyName: string; rent: number; currency: "USD" | "CDF" };

export function ContractFormPreview({ basePath, dashboardHref, action, tenantOptions = [], unitOptions = [] }: { basePath: string; dashboardHref: string; action?: (formData: FormData) => void | Promise<void>; tenantOptions?: TenantOption[]; unitOptions?: UnitOption[] }) {
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function nextStep() {
    const section = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = Array.from(section?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") ?? []);
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) return invalid.reportValidity();
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Aperçu du contrat validé", { description: "Aucune donnée n’a été enregistrée pendant cette phase frontend." });
  }

  return <div className="space-y-6"><div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Contrats", href: basePath }, { label: "Nouveau contrat" }]} /><PageHeader description="Préparez le bail étape par étape, des parties jusqu’aux documents et à la vérification." eyebrow="Assistant contractuel" title="Créer un contrat" /></div><Badge variant="secondary">{action ? "Création transactionnelle dans Supabase" : "Prototype interactif · aucune donnée enregistrée"}</Badge>
    <ol aria-label="Étapes du contrat" className="grid grid-cols-3 gap-2 lg:grid-cols-6">{steps.map(({ label, icon: Icon }, index) => <li className={cn("flex items-center gap-2 rounded-xl border p-2 text-xs font-medium", index === step ? "border-brand-blue bg-brand-blue/5 text-brand-blue" : index < step ? "border-status-paid/25 bg-status-paid/5 text-status-paid" : "text-muted-foreground")} key={label}><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-background"><Icon className="size-3.5" /></span><span className="hidden sm:inline">{index + 1}. {label}</span><span className="sm:hidden">{index + 1}</span></li>)}</ol>
    <form action={action} className="mx-auto max-w-5xl" onSubmit={action ? undefined : handleSubmit} ref={formRef}>
      <WizardSection active={step === 0} description="Sélectionnez le titulaire du futur bail." icon={UserRound} step={0} title="Locataire"><div className="grid gap-3 sm:grid-cols-2">{tenantOptions.map((tenant) => <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 has-checked:border-brand-blue has-checked:bg-brand-blue/5" key={tenant.id}><input className="size-4 accent-brand-blue" name="tenant" required type="radio" value={tenant.id} /><TenantAvatar name={tenant.name} /><div><span className="font-medium">{tenant.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{tenant.phone}</span></div></label>)}</div></WizardSection>
      <WizardSection active={step === 1} description="Choisissez l’unité concernée par le contrat." icon={House} step={1} title="Logement"><div className="grid gap-3 sm:grid-cols-2">{unitOptions.map((unit) => <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 has-checked:border-brand-blue has-checked:bg-brand-blue/5" key={unit.id}><input className="size-4 accent-brand-blue" name="unit" required type="radio" value={unit.id} /><House className="size-5 text-brand-blue" /><div><span className="font-medium">{unit.type} {unit.code}</span><span className="mt-0.5 block text-xs text-muted-foreground">{unit.propertyName} · {unit.rent} {unit.currency}</span></div></label>)}</div></WizardSection>
      <WizardSection active={step === 2} description="Définissez la durée, le loyer et le rythme de paiement." icon={FileText} step={2} title="Conditions locatives"><div className="grid gap-4 sm:grid-cols-2"><Field label="Date de début" name="startDate" required type="date" /><Field label="Date de fin" name="endDate" required type="date" /><Field label="Loyer mensuel" min="0" name="rent" required type="number" /><SelectField label="Devise" name="currency" options={["USD", "CDF"]} /><Field label="Jour d’échéance" max="28" min="1" name="dueDay" required type="number" /><SelectField label="Fréquence" name="frequency" options={["Mensuel", "Trimestriel", "Semestriel", "Annuel"]} /><div className="space-y-2 sm:col-span-2"><Label htmlFor="clauses">Conditions particulières</Label><Textarea id="clauses" name="clauses" placeholder="Ajoutez les clauses particulières du bail..." /></div></div></WizardSection>
      <WizardSection active={step === 3} description="Précisez la garantie et ses modalités." icon={ShieldCheck} step={3} title="Garantie"><div className="grid gap-4 sm:grid-cols-2"><Field label="Montant de la garantie" min="0" name="guarantee" required type="number" /><SelectField label="Statut initial" name="guaranteeStatus" options={["À recevoir", "Reçue", "Partielle"]} /><Field label="Date de versement prévue" name="guaranteeDate" type="date" /><Field label="Préavis de départ (jours)" min="0" name="noticeDays" type="number" /></div></WizardSection>
      <WizardSection active={step === 4} description="Ajoutez le bail signé et ses annexes." icon={UploadCloud} step={4} title="Documents"><label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 p-6 text-center"><UploadCloud className="size-8 text-brand-blue" /><span className="mt-3 font-medium">Glissez le contrat et ses annexes ici</span><span className="mt-1 text-xs text-muted-foreground">PDF, images ou documents bureautiques · plusieurs fichiers autorisés</span><Input className="sr-only" multiple name="documents" type="file" /></label></WizardSection>
      <WizardSection active={step === 5} description="Confirmez les informations avant validation." icon={CheckCircle2} step={5} title="Vérification"><div className="grid gap-3 sm:grid-cols-3">{["Locataire et logement sélectionnés", "Conditions financières renseignées", "Garantie et documents vérifiés"].map((label) => <div className="flex items-center gap-3 rounded-xl bg-status-paid/5 p-4 text-sm" key={label}><CheckCircle2 className="size-5 shrink-0 text-status-paid" />{label}</div>)}</div><label className="mt-5 flex items-start gap-3 rounded-xl border p-4"><input className="mt-0.5 size-4 accent-brand-blue" required type="checkbox" /><span className="text-sm">Je confirme avoir vérifié les informations de cet aperçu contractuel.</span></label></WizardSection>
      <div className="sticky bottom-4 mt-5 flex flex-col-reverse justify-between gap-2 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row"><div>{step === 0 ? <Button asChild variant="outline"><Link href={basePath}>Annuler</Link></Button> : <Button onClick={() => setStep((current) => current - 1)} type="button" variant="outline"><ChevronLeft />Précédent</Button>}</div>{step < steps.length - 1 ? <Button onClick={nextStep} type="button">Continuer <ChevronRight /></Button> : <Button type="submit"><CheckCircle2 />{action ? "Créer le contrat" : "Valider l’aperçu"}</Button>}</div>
    </form></div>;
}

function WizardSection({ active, title, description, icon: Icon, step, children }: { active: boolean; title: string; description: string; icon: LucideIcon; step: number; children: React.ReactNode }) {
  return <Card data-step={step} hidden={!active}><CardHeader><div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon /></span><div><CardTitle>{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></div></div></CardHeader><CardContent>{children}</CardContent></Card>;
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<typeof Input>) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} {...props} /></div>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" id={name} name={name}>{options.map((option) => <option key={option}>{option}</option>)}</select></div>;
}
