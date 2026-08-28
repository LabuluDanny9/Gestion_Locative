import Link from "next/link";
import { House, ListFilter, Plus, Search } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Property, Unit } from "./property-data";
import { UnitCard } from "./unit-card";

export type UnitListParams = { q?: string; status?: string; property?: string; type?: string; creation?: string; erreur?: string };

export function UnitListView({ basePath, dashboardHref, params, properties = [], units = [] }: { basePath: string; dashboardHref: string; params: UnitListParams; properties?: Property[]; units?: Unit[] }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const filtered = units.filter((unit) => {
    const matchesQuery = !query || `${unit.code} ${unit.type} ${unit.propertyName}`.toLocaleLowerCase("fr").includes(query);
    return matchesQuery && (!params.status || params.status === "all" || unit.status === params.status) && (!params.property || params.property === "all" || unit.propertyId === params.property) && (!params.type || params.type === "all" || unit.type === params.type);
  });

  return (
    <div className="space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Logements" }]} /><PageHeader actions={<Button asChild><Link href={`${basePath}/nouveau`}><Plus />Ajouter un logement</Link></Button>} description="Consultez la disponibilité, les caractéristiques, les loyers et l’occupation de chaque unité." eyebrow="Parc locatif" title="Logements" /></div>
      <FilterBar>
        <form action={basePath} className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_repeat(3,auto)_auto]" method="GET">
          <label className="relative"><span className="sr-only">Rechercher un logement</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Code, type, propriété..." /></label>
          <select aria-label="Statut du logement" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="available">Libres</option><option value="occupied">Occupés</option><option value="maintenance">Maintenance</option><option value="reserved">Réservés</option></select>
          <select aria-label="Propriété" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.property ?? "all"} name="property"><option value="all">Toutes les propriétés</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}</select>
          <select aria-label="Type de logement" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.type ?? "all"} name="type"><option value="all">Tous les types</option><option value="Appartement">Appartement</option><option value="Studio">Studio</option><option value="Maison">Maison</option></select>
          <Button type="submit" variant="secondary"><ListFilter />Filtrer</Button>
        </form>
      </FilterBar>
      {filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href={basePath}>Effacer les filtres</Link></Button>} description="Aucun logement ne correspond aux critères actuels." icon={House} title="Aucun logement trouvé" /> : <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((unit) => <UnitCard detailHref={`${basePath}/${unit.id}`} key={unit.id} unit={unit} />)}</div>}
    </div>
  );
}
