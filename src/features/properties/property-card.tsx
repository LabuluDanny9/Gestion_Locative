import Image from "next/image";
import Link from "next/link";
import { Building2, EllipsisVertical, House, MapPin, Users, Wallet } from "lucide-react";

import { MoneyDisplay } from "@/components/shared/money-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import type { Property } from "./property-data";
import { PropertyStatusBadge } from "./property-status-badge";

export function PropertyCard({ property, detailHref }: { property: Property; detailHref: string }) {
  const occupancy = Math.round((property.occupied / property.units) * 100);

  return (
    <Card className="group overflow-hidden p-0 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/7">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          alt={`Vue extérieure de ${property.name}`}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={property.image}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <PropertyStatusBadge className="bg-background/90 backdrop-blur" status={property.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button aria-label={`Actions pour ${property.name}`} className="bg-background/90 backdrop-blur hover:bg-background" size="icon-sm" variant="outline"><EllipsisVertical /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href={detailHref}><Building2 />Voir la propriété</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem disabled>Modifier · bientôt</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-5">
        <Link className="font-heading text-lg font-semibold tracking-tight hover:text-brand-blue" href={detailHref}>{property.name}</Link>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin aria-hidden="true" className="size-3.5" />{property.city}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-3 text-center">
          <div><p className="text-sm font-semibold tabular-nums">{property.units}</p><p className="mt-0.5 text-[0.68rem] text-muted-foreground">logements</p></div>
          <div><p className="text-sm font-semibold tabular-nums text-brand-blue">{property.occupied}</p><p className="mt-0.5 text-[0.68rem] text-muted-foreground">occupés</p></div>
          <div><p className="text-sm font-semibold tabular-nums text-status-paid">{property.available}</p><p className="mt-0.5 text-[0.68rem] text-muted-foreground">libres</p></div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4 border-t pt-4">
          <div><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Wallet className="size-3.5" />Revenu mensuel</p><MoneyDisplay amount={property.monthlyRevenue} className="mt-1 block text-base font-semibold" currency={property.currency} /></div>
          <div className="text-right"><p className="flex items-center justify-end gap-1 text-xs text-muted-foreground"><Users className="size-3.5" />Occupation</p><p className="mt-1 text-sm font-semibold tabular-nums">{occupancy} %</p></div>
        </div>
        <Button asChild className="mt-4 w-full" variant="outline"><Link href={detailHref}><House />Voir les détails</Link></Button>
      </CardContent>
    </Card>
  );
}
