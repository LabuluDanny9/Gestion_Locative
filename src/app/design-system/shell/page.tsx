import type { Metadata } from "next";
import Link from "next/link";
import { LayoutPanelLeft, MonitorSmartphone, SearchCheck } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Aperçu du shell" };

const foundations = [
  {
    icon: LayoutPanelLeft,
    title: "Navigation structurée",
    description: "Quatre groupes métier, états actifs lisibles et modules futurs clairement désactivés.",
  },
  {
    icon: SearchCheck,
    title: "Topbar opérationnelle",
    description: "Recherche, création rapide, notifications, aide, thème et profil sont déjà positionnés.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive natif",
    description: "Sidebar complète sur grand écran, compacte sur tablette, drawer et raccourcis sur mobile.",
  },
] as const;

export default function ShellPreviewPage() {
  return (
    <AppShell displayName="Aperçu design" preview>
      <PageHeader
        actions={<Button asChild variant="outline"><Link href="/design-system">Voir tous les composants</Link></Button>}
        description="Le cadre applicatif est prêt. Les données ci-dessous documentent uniquement sa structure ; aucun dashboard métier n’est encore commencé."
        eyebrow="Étape 2"
        title="Shell global"
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {foundations.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <span className="mb-3 grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-5" /></span>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-6 text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-dashed bg-card/60 px-6 py-12 text-center">
        <p className="font-heading text-lg font-semibold">Zone de contenu prête</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Le dashboard et les pages métier seront intégrés ici lors de l’étape suivante, après validation de ce design system et de ce shell.
        </p>
      </div>
    </AppShell>
  );
}
