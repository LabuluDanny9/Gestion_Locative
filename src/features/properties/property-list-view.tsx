import Link from "next/link";
import { ArrowUpDown, Building2, Grid2X2, HousePlus, List, ListFilter, MapPin, Plus, Search, Wallet } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { properties, type Property } from "./property-data";
import { PropertyCard } from "./property-card";
import { PropertyStatusBadge } from "./property-status-badge";

export type PropertyListParams = { q?: string; status?: string; sort?: string; view?: string };

export function PropertyListView({ basePath, dashboardHref, params }: { basePath: string; dashboardHref: string; params: PropertyListParams }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const filtered = properties
    .filter((property) => !query || `${property.name} ${property.city} ${property.type}`.toLocaleLowerCase("fr").includes(query))
    .filter((property) => !params.status || params.status === "all" || property.status === params.status)
    .toSorted((a, b) => params.sort === "revenue" ? b.monthlyRevenue - a.monthlyRevenue : a.name.localeCompare(b.name, "fr"));
  const view = params.view === "table" ? "table" : "cards";
  const totalUnits = properties.reduce((sum, property) => sum + property.units, 0);
  const totalRevenue = properties.reduce((sum, property) => sum + property.monthlyRevenue, 0);

  const columns: DataTableColumn<Property>[] = [
    { key: "name", header: "Propriété", render: (property) => <div><Link className="font-semibold hover:text-brand-blue" href={`${basePath}/${property.id}`}>{property.name}</Link><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{property.city}</p></div> },
    { key: "units", header: "Logements", render: (property) => `${property.units} unités` },
    { key: "occupation", header: "Occupation", render: (property) => `${property.occupied}/${property.units}` },
    { key: "revenue", header: "Revenu mensuel", className: "text-right", render: (property) => <MoneyDisplay amount={property.monthlyRevenue} currency={property.currency} /> },
    { key: "status", header: "Statut", render: (property) => <PropertyStatusBadge status={property.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Propriétés" }]} /><PageHeader actions={<Button asChild><Link href={`${basePath}/nouvelle`}><Plus />Ajouter une propriété</Link></Button>} description="Centralisez vos immeubles, maisons et résidences, puis suivez leur occupation et leur rendement." eyebrow="Gestion immobilière" title="Propriétés" /></div>

      <section aria-label="Synthèse du patrimoine" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Propriétés", value: properties.length, icon: Building2 },
          { label: "Logements", value: totalUnits, icon: HousePlus },
          { label: "Occupation", value: `${Math.round(properties.reduce((sum, item) => sum + item.occupied, 0) / totalUnits * 100)} %`, icon: ListFilter },
          { label: "Revenu mensuel", value: `${new Intl.NumberFormat("fr-CD").format(totalRevenue)} USD`, icon: Wallet },
        ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 font-heading text-lg font-semibold tabular-nums">{value}</p></div></CardContent></Card>)}
      </section>

      <FilterBar>
        <form action={basePath} className="flex flex-1 flex-col gap-2 sm:flex-row" method="GET">
          <label className="relative flex-1"><span className="sr-only">Rechercher une propriété</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Rechercher une propriété..." /></label>
          <select aria-label="Filtrer par statut" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="active">Actifs</option><option value="maintenance">Maintenance</option><option value="inactive">Inactifs</option></select>
          <select aria-label="Trier les propriétés" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.sort ?? "name"} name="sort"><option value="name">Nom A–Z</option><option value="revenue">Revenu décroissant</option></select>
          <input name="view" type="hidden" value={view} />
          <Button type="submit" variant="secondary"><ArrowUpDown />Appliquer</Button>
        </form>
        <div className="flex rounded-lg border p-1">
          <Button asChild aria-label="Afficher les cartes" size="icon-sm" variant={view === "cards" ? "secondary" : "ghost"}><Link href={{ pathname: basePath, query: { ...params, view: "cards" } }}><Grid2X2 /></Link></Button>
          <Button asChild aria-label="Afficher le tableau" size="icon-sm" variant={view === "table" ? "secondary" : "ghost"}><Link href={{ pathname: basePath, query: { ...params, view: "table" } }}><List /></Link></Button>
        </div>
      </FilterBar>

      {filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href={basePath}>Effacer les filtres</Link></Button>} description="Modifiez la recherche ou ajoutez une nouvelle propriété." icon={Building2} title="Aucune propriété trouvée" /> : view === "table" ? <DataTable columns={columns} getRowKey={(property) => property.id} rows={filtered} /> : <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((property) => <PropertyCard detailHref={`${basePath}/${property.id}`} key={property.id} property={property} />)}</div>}
    </div>
  );
}
