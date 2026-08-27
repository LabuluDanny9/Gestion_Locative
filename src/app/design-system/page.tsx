import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Home,
  Info,
  KeyRound,
  Plus,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState, LoadingSkeleton } from "@/components/shared/feedback-state";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { RentalStatusBadge, type RentalStatus } from "@/components/shared/rental-status-badge";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = { title: "Design system" };

const colors = [
  { name: "Navy 950", value: "#0F172A", className: "bg-[#0F172A]" },
  { name: "Navy 900", value: "#172554", className: "bg-[#172554]" },
  { name: "Blue 600", value: "#2563EB", className: "bg-[#2563EB]" },
  { name: "Blue 500", value: "#3B82F6", className: "bg-[#3B82F6]" },
  { name: "Gold 500", value: "#D4A72C", className: "bg-[#D4A72C]" },
  { name: "Surface", value: "#F7F8FC", className: "bg-[#F7F8FC]" },
] as const;

type PaymentSample = {
  id: string;
  tenant: string;
  unit: string;
  amount: number;
  status: RentalStatus;
};

const paymentRows: PaymentSample[] = [
  { id: "REC-2026-041", tenant: "Mireille Kabeya", unit: "A-04", amount: 850, status: "paid" },
  { id: "REC-2026-042", tenant: "Daniel Ilunga", unit: "B-12", amount: 1200, status: "dueSoon" },
  { id: "REC-2026-043", tenant: "Sarah Mutombo", unit: "C-02", amount: 650, status: "late" },
];

const paymentColumns: DataTableColumn<PaymentSample>[] = [
  { key: "receipt", header: "Référence", render: (row) => <span className="font-medium">{row.id}</span> },
  { key: "tenant", header: "Locataire", render: (row) => row.tenant },
  { key: "unit", header: "Logement", render: (row) => row.unit },
  { key: "amount", header: "Montant", className: "text-right", render: (row) => <MoneyDisplay amount={row.amount} /> },
  { key: "status", header: "Statut", render: (row) => <RentalStatusBadge status={row.status} /> },
];

function Section({ id, title, description, children }: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 border-t pt-10">
      <div className="mb-6 max-w-2xl">
        <h2 className="font-heading text-xl font-semibold tracking-tight" id={id}>{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[96rem] items-center justify-between px-5 sm:px-8">
          <Link aria-label="Retour à l’accueil" href="/"><BrandMark /></Link>
          <div className="flex items-center gap-2">
            <Badge className="hidden sm:inline-flex" variant="secondary">Référence interne · v1</Badge>
            <ThemeToggle />
            <Button asChild size="sm"><Link href="/design-system/dashboard">Voir le dashboard <ArrowRight /></Link></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[96rem] px-5 py-10 sm:px-8 sm:py-14">
        <PageHeader
          description="Fondations visuelles et composants de référence pour une interface locative premium, cohérente, accessible et adaptée aux données financières."
          eyebrow="AMIRANDA EMPIRE"
          title="Design system"
        />

        <nav aria-label="Sections du design system" className="my-9 flex flex-wrap gap-2 rounded-xl border bg-card p-2 shadow-sm">
          {["Couleurs", "Typographie", "Actions", "Formulaires", "Statuts", "Données", "États"].map((item) => (
            <a className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" href={`#${item.toLowerCase()}`} key={item}>{item}</a>
          ))}
        </nav>

        <div className="space-y-12">
          <Section description="Le navy structure la marque, le bleu signale les actions et l’or reste réservé aux accents premium discrets." id="couleurs" title="Couleurs et surfaces">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {colors.map((color) => (
                <Card className="py-3" key={color.name}>
                  <CardContent className="px-3">
                    <div className={`h-20 rounded-lg border border-black/5 ${color.className}`} />
                    <p className="mt-3 text-sm font-semibold">{color.name}</p>
                    <code className="mt-1 block text-xs text-muted-foreground">{color.value}</code>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Succès", "bg-status-paid", "text-status-paid"],
                ["Attention", "bg-status-due-soon", "text-status-due-soon"],
                ["Retard", "bg-status-late", "text-status-late"],
                ["Impayé", "bg-status-arrears", "text-status-arrears"],
              ].map(([label, bg, textColor]) => (
                <div className="flex items-center gap-3 rounded-xl border bg-card p-3" key={label}>
                  <span className={`size-3 rounded-full ${bg}`} /><span className={`text-sm font-medium ${textColor}`}>{label}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section description="Geist assure la lisibilité. Les titres restent compacts et les valeurs financières utilisent des chiffres tabulaires." id="typographie" title="Typographie et hiérarchie">
            <Card>
              <CardContent className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-5">
                  <div><p className="text-xs text-muted-foreground">Titre de page · 32 px</p><p className="mt-1 font-heading text-[2rem] font-semibold tracking-[-0.025em]">Vue d’ensemble</p></div>
                  <div><p className="text-xs text-muted-foreground">Titre de section · 20 px</p><p className="mt-1 font-heading text-xl font-semibold">Performance locative</p></div>
                  <div><p className="text-xs text-muted-foreground">Corps · 14–16 px</p><p className="mt-1 max-w-xl text-sm leading-6">Une densité confortable pour lire rapidement les loyers, échéances, contrats et alertes.</p></div>
                </div>
                <div className="rounded-xl bg-primary p-6 text-primary-foreground">
                  <p className="text-sm text-white/65">Revenus encaissés</p>
                  <p className="mt-3 font-heading text-4xl font-semibold tracking-[-0.04em] tabular-nums">24 850 $</p>
                  <p className="mt-3 text-sm text-emerald-300">+8,4 % ce mois</p>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section description="Les actions primaires sont nettes et mesurées. Le dialogue ci-dessous est pleinement interactif." id="actions" title="Boutons et confirmations">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-5">
              <Button asChild><Link href="/espace"><Home />Action primaire</Link></Button>
              <Button asChild variant="secondary"><Link href="/profil"><Users />Action secondaire</Link></Button>
              <Button asChild variant="outline"><Link href="/"><ArrowRight />Action tertiaire</Link></Button>
              <Button disabled><Plus />Indisponible</Button>
              <ConfirmDialog
                description="Cette démonstration vérifie la hiérarchie, la formulation et le focus clavier du composant. Aucune donnée n’est supprimée."
                destructive
                confirmLabel="Confirmer la démo"
                title="Confirmer cette action ?"
                trigger={<Button variant="destructive"><AlertTriangle />Action sensible</Button>}
              />
            </div>
          </Section>

          <Section description="Libellés visibles, aide contextuelle, focus contrasté, erreurs explicites et zones tactiles confortables." id="formulaires" title="Formulaires et recherche">
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Informations du logement</CardTitle><CardDescription>Exemple de densité standard.</CardDescription></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="property">Propriété</Label><Input defaultValue="Résidence Mwezi" id="property" /></div>
                  <div className="space-y-2"><Label htmlFor="unit">Référence</Label><Input defaultValue="A-04" id="unit" /></div>
                  <div className="space-y-2 sm:col-span-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" placeholder="Ajouter une précision utile..." /></div>
                  <Button className="sm:col-span-2" disabled>Enregistrer l’exemple</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Recherche</CardTitle><CardDescription>Le composant conserve une largeur adaptable et un libellé accessible.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <SearchInput aria-label="Rechercher dans les exemples" placeholder="Rechercher un locataire, logement, reçu..." />
                  <Alert><Info /><AlertTitle>Conseil</AlertTitle><AlertDescription>La recherche globale acceptera le nom, le téléphone, la référence et le numéro de reçu.</AlertDescription></Alert>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section description="Le statut ne dépend jamais uniquement de la couleur : un libellé et une icône l’accompagnent toujours." id="statuts" title="Badges et statuts métier">
            <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-5">
              {(["upcoming", "dueSoon", "paid", "partial", "late", "arrears"] as RentalStatus[]).map((status) => <RentalStatusBadge key={status} status={status} />)}
              <Badge variant="secondary"><ShieldCheck />Administrateur</Badge>
              <Badge variant="outline"><KeyRound />Lecture seule</Badge>
            </div>
          </Section>

          <Section description="Les KPI, montants et tableaux partagent des alignements stables pour accélérer la lecture." id="données" title="Cartes, tableaux et graphiques">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard helper="12 propriétés actives" icon={Building2} label="Patrimoine" tone="blue" value="36 logements" />
              <StatCard helper="Ce mois" icon={CircleDollarSign} label="Encaissé" tone="green" value="24 850 $" />
              <StatCard helper="4 échéances proches" icon={WalletCards} label="À percevoir" tone="amber" value="5 200 $" />
              <StatCard helper="2 dossiers à traiter" icon={AlertTriangle} label="Arriérés" tone="red" value="1 450 $" />
            </div>
            <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
              <DataTable columns={paymentColumns} getRowKey={(row) => row.id} rows={paymentRows} />
              <Card>
                <CardHeader><CardTitle>Palette analytique</CardTitle><CardDescription>Exemple de comparaison mensuelle sans dépendance graphique.</CardDescription></CardHeader>
                <CardContent>
                  <div aria-label="Graphique exemple des encaissements mensuels" className="flex h-48 items-end gap-3" role="img">
                    {[42, 64, 52, 78, 68, 91, 82].map((height, index) => (
                      <div className="flex flex-1 flex-col items-center gap-2" key={height + index}>
                        <div className="w-full rounded-t-md bg-brand-blue/85" style={{ height: `${height}%` }} />
                        <span className="text-[0.65rem] text-muted-foreground">{["F", "M", "A", "M", "J", "J", "A"][index]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section description="Chaque écran prévoit ses situations vides, en chargement et en erreur avant l’intégration du backend." id="états" title="États système">
            <div className="grid gap-5 lg:grid-cols-3">
              <EmptyState description="Ajoutez un premier document lorsque le module sera disponible." icon={FileText} title="Aucun document" />
              <LoadingSkeleton />
              <ErrorState />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Alert className="border-status-paid/25 bg-status-paid/5"><CheckCircle2 /><AlertTitle>Opération réussie</AlertTitle><AlertDescription>Le paiement a été enregistré.</AlertDescription></Alert>
              <Alert className="border-status-due-soon/25 bg-status-due-soon/5"><Info /><AlertTitle>Échéance proche</AlertTitle><AlertDescription>Un loyer arrive à échéance.</AlertDescription></Alert>
              <Alert variant="destructive"><AlertTriangle /><AlertTitle>Action impossible</AlertTitle><AlertDescription>Vérifiez les informations saisies.</AlertDescription></Alert>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
