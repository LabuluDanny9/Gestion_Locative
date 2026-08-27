import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Building2, Layers3, Maximize, Sofa } from "lucide-react";

import { MoneyDisplay } from "@/components/shared/money-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Unit } from "./property-data";
import { UnitStatusBadge } from "./property-status-badge";

export function UnitCard({ unit, detailHref }: { unit: Unit; detailHref: string }) {
  return (
    <Card className="group overflow-hidden p-0 transition-shadow hover:shadow-lg hover:shadow-slate-950/7">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image alt={`Vue de ${unit.type} ${unit.code}`} className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" src={unit.image} />
        <UnitStatusBadge className="absolute top-4 left-4 bg-background/90 backdrop-blur" status={unit.status} />
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div><Link className="font-heading text-lg font-semibold hover:text-brand-blue" href={detailHref}>{unit.type} {unit.code}</Link><p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Building2 className="size-3.5" />{unit.propertyName}</p></div>
          <div className="text-right"><MoneyDisplay amount={unit.rent} className="font-semibold" currency={unit.currency} /><p className="text-[0.68rem] text-muted-foreground">par mois</p></div>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2 border-y py-4 text-center text-xs text-muted-foreground">
          <span className="flex flex-col items-center gap-1"><BedDouble className="size-4" />{unit.bedrooms}</span>
          <span className="flex flex-col items-center gap-1"><Sofa className="size-4" />{unit.livingRooms}</span>
          <span className="flex flex-col items-center gap-1"><Bath className="size-4" />{unit.bathrooms}</span>
          <span className="flex flex-col items-center gap-1"><Maximize className="size-4" />{unit.area} m²</span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Layers3 className="size-3.5" />{unit.building} · {unit.floor}</p>
        <Button asChild className="mt-4 w-full" variant="outline"><Link href={detailHref}>Voir le logement</Link></Button>
      </CardContent>
    </Card>
  );
}
