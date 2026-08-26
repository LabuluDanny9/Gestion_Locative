import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Database,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { EmptyState } from "@/components/shared/empty-state";
import {
  RentalStatusBadge,
  rentalStatuses,
} from "@/components/shared/rental-status-badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

const foundations = [
  "Next.js App Router et TypeScript strict",
  "Tailwind CSS et composants shadcn/ui",
  "Thème clair/sombre et typographie Geist",
  "Validation d’environnement et tests unitaires",
];

const capabilities = [
  {
    icon: LayoutDashboard,
    title: "Interface cohérente",
    description:
      "Des composants réutilisables, accessibles et prêts à accueillir les futurs parcours métier.",
  },
  {
    icon: Database,
    title: "Architecture évolutive",
    description:
      "Une structure par fonctionnalités pour faire grandir le produit sans disperser la logique métier.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité dès le socle",
    description:
      "Les secrets restent côté serveur et la future protection des données est anticipée avant Supabase.",
  },
];

export default function HomePage() {
  return (
    <main className="app-background min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Badge className="hidden rounded-full sm:inline-flex" variant="secondary">
              Phase 1 · Fondation
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-18 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <Badge className="mb-5 rounded-full border-primary/15 bg-primary/5 text-primary" variant="outline">
            <Sparkles aria-hidden="true" className="mr-1.5 size-3.5" />
            Une gestion claire, du bail au paiement
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            Le socle d’une gestion locative fiable et moderne.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {siteConfig.description} La première phase installe une base technique,
            visuelle et testable, sans inventer de données métier.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#fondation">
                Découvrir la fondation
                <ArrowDown aria-hidden="true" className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={siteConfig.links.github} rel="noreferrer" target="_blank">
                Voir le dépôt
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-primary/10 bg-card/90 shadow-xl shadow-primary/5">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="font-heading">État du socle</CardTitle>
                <CardDescription className="mt-1">Prêt pour les modules métier</CardDescription>
              </div>
              <span className="grid size-11 place-items-center rounded-xl bg-status-paid/10 text-status-paid">
                <Check aria-hidden="true" className="size-5" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {foundations.map((foundation) => (
              <div className="flex items-center gap-3 text-sm" key={foundation}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-status-paid/10 text-status-paid">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                <span>{foundation}</span>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Données métier</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Supabase et authentification</p>
              </div>
              <Badge className="rounded-full" variant="outline">Phase 2</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8" id="fondation">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Fondation produit</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Une base préparée pour durer
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Chaque choix de cette phase réduit le coût des prochaines fonctionnalités.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <Card className="bg-card/75" key={title}>
              <CardHeader>
                <span className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/8 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <CardTitle className="font-heading text-lg">{title}</CardTitle>
                <CardDescription className="leading-6">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-card/55">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-18 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Langage visuel</p>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight">Des statuts lisibles au premier regard</h2>
            <p className="mt-3 max-w-md leading-7 text-muted-foreground">
              Les couleurs métier sont définies une seule fois et resteront cohérentes dans les tableaux, cartes et alertes.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Statuts locatifs</CardTitle>
              <CardDescription>Palette sémantique prête pour les vraies données.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(Object.keys(rentalStatuses) as Array<keyof typeof rentalStatuses>).map((status) => (
                <RentalStatusBadge key={status} status={status} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <Alert className="h-fit border-primary/15 bg-primary/4">
          <CircleDollarSign aria-hidden="true" />
          <AlertTitle>Aucune donnée financière simulée</AlertTitle>
          <AlertDescription>
            Les loyers, paiements et soldes seront calculés à partir des données persistées lors des prochaines phases.
          </AlertDescription>
        </Alert>
        <EmptyState
          description="Les premières propriétés apparaîtront ici lorsque le modèle de données et les droits d’accès seront en place."
          icon={Database}
          title="Le portefeuille est encore vide"
        />
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <BrandMark compact />
          <p>Fondation technique · Phase 1</p>
        </div>
      </footer>
    </main>
  );
}
