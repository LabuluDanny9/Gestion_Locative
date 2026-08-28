import Image from "next/image";
import Link from "next/link";
import { Building2, FileText, House, Layers3, MapPin, Pencil, Plus, Users, Wallet } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Property, Unit } from "./property-data";
import { PropertyStatusBadge } from "./property-status-badge";
import { UnitCard } from "./unit-card";

export function PropertyDetailView({ property, basePath, unitBasePath, dashboardHref, propertyUnits = [] }: { property: Property; basePath: string; unitBasePath: string; dashboardHref: string; propertyUnits?: Unit[] }) {
  const occupancy = property.units ? Math.round((property.occupied / property.units) * 100) : 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Propriétés", href: basePath }, { label: property.name }]} />
      <section className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="relative h-64 sm:h-80 xl:h-96"><Image alt={`Façade de ${property.name}`} className="object-cover" fill priority sizes="(max-width: 768px) 100vw, 80vw" src={property.image} /><div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/15 to-transparent" /></div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-5 p-5 text-white sm:flex-row sm:items-end sm:p-8">
          <div><div className="mb-3 flex flex-wrap gap-2"><PropertyStatusBadge className="border-white/20 bg-white/90 text-slate-900" status={property.status} /><span className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-xs backdrop-blur">{property.units} logements</span></div><h1 className="font-heading text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{property.name}</h1><p className="mt-2 flex items-center gap-2 text-sm text-white/75"><MapPin className="size-4" />{property.type} · {property.city}</p></div>
          <div className="flex gap-2"><Button className="border-white/25 bg-white/10 text-white hover:bg-white/20" disabled variant="outline"><Pencil />Modifier</Button><Button asChild className="bg-white text-slate-950 hover:bg-white/90"><Link href={`${unitBasePath}/nouveau?property=${property.id}`}><Plus />Ajouter un logement</Link></Button></div>
        </div>
      </section>

      <section aria-label="Indicateurs de la propriété" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Logements", value: property.units, helper: `${property.available} libres`, icon: House },
          { label: "Occupation", value: `${occupancy} %`, helper: `${property.occupied} occupés`, icon: Users },
          { label: "Bâtiments", value: property.buildings, helper: `${property.floors} niveaux`, icon: Building2 },
          { label: "Revenu mensuel", value: <MoneyDisplay amount={property.monthlyRevenue} currency={property.currency} />, helper: "Revenu contractuel", icon: Wallet },
        ].map(({ label, value, helper, icon: Icon }) => <Card key={label}><CardContent className="p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><p className="mt-3 text-xs text-muted-foreground">{label}</p><div className="mt-1 font-heading text-xl font-semibold tabular-nums">{value}</div><p className="mt-1 text-xs text-muted-foreground">{helper}</p></CardContent></Card>)}
      </section>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto" variant="line">
          <TabsTrigger value="overview">Vue d’ensemble</TabsTrigger><TabsTrigger value="units">Logements</TabsTrigger><TabsTrigger value="buildings">Bâtiments</TabsTrigger><TabsTrigger value="floors">Étages</TabsTrigger><TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent className="pt-6" value="overview">
          <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <Card><CardHeader><CardTitle>À propos de la propriété</CardTitle><CardDescription>{property.address}</CardDescription></CardHeader><CardContent><p className="leading-7 text-muted-foreground">{property.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Structure</p><p className="mt-1 font-semibold">{property.buildings} bâtiment{property.buildings > 1 ? "s" : ""} · {property.floors} niveaux</p></div><div className="rounded-xl bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Disponibilité</p><p className="mt-1 font-semibold text-status-paid">{property.available} logement{property.available > 1 ? "s" : ""} libre{property.available > 1 ? "s" : ""}</p></div></div></CardContent></Card>
            <Card><CardHeader><CardTitle>Occupation réelle</CardTitle><CardDescription>Calculée depuis les logements enregistrés</CardDescription></CardHeader><CardContent className="space-y-5"><div><div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">Occupation</span><span className="font-semibold">{occupancy} %</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-brand-blue" style={{ width: `${occupancy}%` }} /></div></div></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent className="pt-6" value="units">{propertyUnits.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{propertyUnits.map((unit) => <UnitCard detailHref={`${unitBasePath}/${unit.id}`} key={unit.id} unit={unit} />)}</div> : <EmptyState description="Ajoutez le premier logement de cette propriété." icon={House} title="Aucun logement" />}</TabsContent>
        <TabsContent className="pt-6" value="buildings"><div className="grid gap-4 md:grid-cols-2">{Array.from({ length: property.buildings }, (_, index) => <Card key={index}><CardHeader><span className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Building2 /></span><CardTitle className="mt-3">{property.buildings > 1 ? `Bâtiment ${String.fromCharCode(65 + index)}` : "Bâtiment principal"}</CardTitle><CardDescription>{property.floors} niveaux · {Math.ceil(property.units / property.buildings)} logements</CardDescription></CardHeader><CardContent><div className="flex justify-between rounded-xl bg-muted/50 p-3 text-sm"><span className="text-muted-foreground">Occupation</span><span className="font-semibold">{Math.max(1, Math.floor(property.occupied / property.buildings))} unités occupées</span></div></CardContent></Card>)}</div></TabsContent>
        <TabsContent className="pt-6" value="floors"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: property.floors }, (_, index) => <Card key={index}><CardHeader><span className="grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground"><Layers3 /></span><CardTitle className="mt-3">{index === 0 ? "Rez-de-chaussée" : `${index}er étage`.replace("1er", "1er").replace("2er", "2e").replace("3er", "3e")}</CardTitle><CardDescription>{Math.ceil(property.units / property.floors)} logements</CardDescription></CardHeader></Card>)}</div></TabsContent>
        <TabsContent className="pt-6" value="documents"><EmptyState description="Les plans, titres et documents techniques apparaîtront dans cet espace." icon={FileText} title="Aucun document ajouté" /></TabsContent>
      </Tabs>
    </div>
  );
}
