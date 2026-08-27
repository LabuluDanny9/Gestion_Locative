import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Building2, CalendarDays, CookingPot, FileSignature, Layers3, Maximize, Sofa, UserRound } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { Unit } from "./property-data";
import { UnitStatusBadge } from "./property-status-badge";

export function UnitDetailView({ unit, basePath, propertyBasePath, tenantBasePath, dashboardHref }: { unit: Unit; basePath: string; propertyBasePath: string; tenantBasePath: string; dashboardHref: string }) {
  const characteristics = [
    { label: "Chambres", value: unit.bedrooms, icon: BedDouble }, { label: "Salon", value: unit.livingRooms, icon: Sofa }, { label: "Salle de bain", value: unit.bathrooms, icon: Bath }, { label: "Cuisine", value: unit.kitchens, icon: CookingPot }, { label: "Superficie", value: `${unit.area} m²`, icon: Maximize }, { label: "Étage", value: unit.floor, icon: Layers3 },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Logements", href: basePath }, { label: `${unit.type} ${unit.code}` }]} />
      <section className="grid gap-3 overflow-hidden rounded-2xl lg:grid-cols-[2fr_1fr] lg:grid-rows-2">
        <div className="relative h-72 overflow-hidden rounded-2xl bg-muted lg:row-span-2 lg:h-[30rem]"><Image alt={`Vue principale du logement ${unit.code}`} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 66vw" src={unit.image} /></div>
        <div className="relative hidden overflow-hidden rounded-2xl bg-muted lg:block"><Image alt="Détail architectural" className="scale-125 object-cover object-left" fill sizes="33vw" src={unit.image} /></div>
        <div className="relative hidden overflow-hidden rounded-2xl bg-muted lg:block"><Image alt="Environnement de la résidence" className="scale-125 object-cover object-right" fill sizes="33vw" src={unit.image} /></div>
      </section>
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2"><UnitStatusBadge status={unit.status} /><span className="text-xs text-muted-foreground">{unit.building} · {unit.floor}</span></div><h1 className="font-heading text-3xl font-semibold tracking-[-0.03em]">{unit.type} {unit.code}</h1><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="size-4" />{unit.propertyName}</p></div><div className="sm:text-right"><MoneyDisplay amount={unit.rent} className="font-heading text-3xl font-semibold" currency={unit.currency} /><p className="mt-1 text-sm text-muted-foreground">par mois</p></div></header>
      <section aria-label="Caractéristiques du logement" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{characteristics.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon className="size-4.5" /></span><p className="mt-3 text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></CardContent></Card>)}</section>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        {unit.tenant ? <Card><CardHeader><CardDescription>Occupé par</CardDescription><CardTitle className="text-xl">{unit.tenant.name}</CardTitle></CardHeader><CardContent><div className="rounded-xl bg-muted/50 p-4"><p className="text-sm font-medium">{unit.tenant.code}</p><p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4" />Contrat actif · {unit.tenant.contractStart} → {unit.tenant.contractEnd}</p></div><div className="mt-4 flex flex-wrap gap-2"><Button asChild variant="outline"><Link href={`${tenantBasePath}/${unit.tenant.id}`}><UserRound />Voir le locataire</Link></Button><Button disabled variant="outline"><FileSignature />Voir le contrat</Button></div></CardContent></Card> : <Card><CardHeader><CardTitle>Logement disponible</CardTitle><CardDescription>Ce logement peut être affecté à un prochain contrat.</CardDescription></CardHeader><CardContent><Button disabled>Créer un contrat · bientôt</Button></CardContent></Card>}
        <Card><CardHeader><CardTitle>Rattachement</CardTitle><CardDescription>Structure immobilière</CardDescription></CardHeader><CardContent className="space-y-3"><div className="flex justify-between rounded-xl bg-muted/50 p-3 text-sm"><span className="text-muted-foreground">Propriété</span><Link className="font-semibold hover:text-brand-blue" href={`${propertyBasePath}/${unit.propertyId}`}>{unit.propertyName}</Link></div><div className="flex justify-between rounded-xl bg-muted/50 p-3 text-sm"><span className="text-muted-foreground">Bâtiment</span><span className="font-semibold">{unit.building}</span></div><div className="flex justify-between rounded-xl bg-muted/50 p-3 text-sm"><span className="text-muted-foreground">Niveau</span><span className="font-semibold">{unit.floor}</span></div></CardContent></Card>
      </div>
    </div>
  );
}
