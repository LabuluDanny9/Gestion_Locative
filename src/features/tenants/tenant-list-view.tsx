import Link from "next/link";
import { AlertTriangle, CalendarClock, CirclePlus, Search, UserCheck, Users, WalletCards } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { TenantCard } from "./tenant-card";
import { tenants, type Tenant } from "./tenant-data";
import { TenantStatusBadge } from "./tenant-status-badge";

export type TenantListParams = { q?: string; status?: string; property?: string };

export function TenantListView({ basePath, dashboardHref, params }: { basePath: string; dashboardHref: string; params: TenantListParams }) {
  const query = params.q?.trim().toLocaleLowerCase("fr") ?? "";
  const filtered = tenants.filter((tenant) => {
    const matchesQuery = !query || `${tenant.name} ${tenant.code} ${tenant.phone} ${tenant.unitLabel}`.toLocaleLowerCase("fr").includes(query);
    const matchesStatus = !params.status || params.status === "all" || tenant.status === params.status;
    const matchesProperty = !params.property || params.property === "all" || tenant.propertyId === params.property;
    return matchesQuery && matchesStatus && matchesProperty;
  });
  const totalRent = tenants.reduce((sum, tenant) => sum + tenant.rent, 0);
  const totalBalance = tenants.reduce((sum, tenant) => sum + tenant.balance, 0);
  const propertyOptions = Array.from(new Map(tenants.map((tenant) => [tenant.propertyId, tenant.propertyName])).entries());

  const columns: DataTableColumn<Tenant>[] = [
    { key: "tenant", header: "Locataire", render: (tenant) => <div className="flex items-center gap-3"><TenantAvatar name={tenant.name} /><div><Link className="font-semibold hover:text-brand-blue" href={`${basePath}/${tenant.id}`}>{tenant.name}</Link><p className="mt-0.5 text-xs text-muted-foreground">{tenant.code}</p></div></div> },
    { key: "phone", header: "Téléphone", render: (tenant) => <a className="whitespace-nowrap hover:text-brand-blue" href={`tel:${tenant.phone.replace(/\s/g, "")}`}>{tenant.phone}</a> },
    { key: "unit", header: "Logement", render: (tenant) => <div><p className="font-medium">{tenant.unitLabel}</p><p className="mt-0.5 text-xs text-muted-foreground">{tenant.propertyName}</p></div> },
    { key: "rent", header: "Loyer", render: (tenant) => <MoneyDisplay amount={tenant.rent} currency={tenant.currency} /> },
    { key: "due", header: "Prochaine échéance", render: (tenant) => <span className="whitespace-nowrap text-sm">{tenant.nextDueDate}</span> },
    { key: "balance", header: "Solde", render: (tenant) => <MoneyDisplay amount={tenant.balance} className={tenant.balance > 0 ? "font-semibold text-status-late" : "text-muted-foreground"} currency={tenant.currency} /> },
    { key: "status", header: "Statut", render: (tenant) => <TenantStatusBadge status={tenant.status} /> },
    { key: "actions", header: "Actions", className: "text-right", render: (tenant) => <Button asChild size="sm" variant="ghost"><Link href={`${basePath}/${tenant.id}`}>Voir</Link></Button> },
  ];

  return (
    <div className="space-y-6">
      <div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Locataires" }]} /><PageHeader actions={<Button asChild><Link href={`${basePath}/nouveau`}><CirclePlus />Ajouter un locataire</Link></Button>} description="Suivez chaque occupation, échéance et situation financière depuis un dossier unique." eyebrow="Gestion locative" title="Locataires" /></div>

      <section aria-label="Synthèse des locataires" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Locataires actifs", value: tenants.length, icon: Users },
          { label: "À jour", value: tenants.filter((tenant) => tenant.status === "current").length, icon: UserCheck },
          { label: "Loyers mensuels", value: `${new Intl.NumberFormat("fr-CD").format(totalRent)} USD`, icon: WalletCards },
          { label: "Solde à recouvrer", value: `${new Intl.NumberFormat("fr-CD").format(totalBalance)} USD`, icon: AlertTriangle },
        ].map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon aria-hidden="true" className="size-4.5" /></span><div className="min-w-0"><p className="truncate text-xs text-muted-foreground">{label}</p><p className="mt-0.5 truncate font-heading text-lg font-semibold tabular-nums">{value}</p></div></CardContent></Card>)}
      </section>

      <FilterBar>
        <form action={basePath} className="grid flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_13rem_13rem_auto]" method="GET">
          <label className="relative"><span className="sr-only">Rechercher un locataire</span><Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" defaultValue={params.q} name="q" placeholder="Nom, code, téléphone..." /></label>
          <select aria-label="Filtrer par statut" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Tous les statuts</option><option value="current">À jour</option><option value="partial">Paiement partiel</option><option value="late">En retard</option><option value="arrears">Arriérés</option></select>
          <select aria-label="Filtrer par propriété" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.property ?? "all"} name="property"><option value="all">Toutes les propriétés</option>{propertyOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
          <Button type="submit" variant="secondary"><CalendarClock />Appliquer</Button>
        </form>
      </FilterBar>

      {filtered.length === 0 ? <EmptyState action={<Button asChild variant="outline"><Link href={basePath}>Effacer les filtres</Link></Button>} description="Modifiez votre recherche ou ajoutez un nouveau dossier locataire." icon={Users} title="Aucun locataire trouvé" /> : <><div className="grid gap-4 lg:hidden">{filtered.map((tenant) => <TenantCard href={`${basePath}/${tenant.id}`} key={tenant.id} tenant={tenant} />)}</div><div className="hidden overflow-x-auto lg:block"><DataTable className="min-w-[75rem]" columns={columns} getRowKey={(tenant) => tenant.id} rows={filtered} /></div></>}
    </div>
  );
}
