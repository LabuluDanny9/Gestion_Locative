import Link from "next/link";
import { CalendarRange, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { dashboardPeriodLabels, type DashboardPeriod } from "./dashboard-data";

type PeriodFilterProps = {
  period: DashboardPeriod;
  basePath: string;
  startDate?: string;
  endDate?: string;
};

const quickPeriods: DashboardPeriod[] = ["month", "quarter", "half", "year"];

export function PeriodFilter({ period, basePath, startDate, endDate }: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="hidden rounded-xl border bg-card p-1 shadow-xs xl:flex">
        {quickPeriods.map((item) => (
          <Link
            aria-current={period === item ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              period === item && "bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground",
            )}
            href={`${basePath}?periode=${item}`}
            key={item}
          >
            {dashboardPeriodLabels[item]}
          </Link>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="xl:hidden" variant="outline">{dashboardPeriodLabels[period]}<ChevronDown /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {quickPeriods.map((item) => (
            <DropdownMenuItem asChild key={item}><Link href={`${basePath}?periode=${item}`}>{dashboardPeriodLabels[item]}</Link></DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={period === "custom" ? "secondary" : "outline"}><CalendarRange />{period === "custom" ? "Période personnalisée" : "Personnaliser"}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir une période</DialogTitle>
            <DialogDescription>Définissez l’intervalle utilisé par les indicateurs et les analyses du dashboard.</DialogDescription>
          </DialogHeader>
          <form action={basePath} className="space-y-5" method="GET">
            <input name="periode" type="hidden" value="custom" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="dashboard-start">Du</Label><Input defaultValue={startDate ?? "2026-03-01"} id="dashboard-start" name="debut" required type="date" /></div>
              <div className="space-y-2"><Label htmlFor="dashboard-end">Au</Label><Input defaultValue={endDate ?? "2026-08-31"} id="dashboard-end" name="fin" required type="date" /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
              <Button type="submit">Appliquer la période</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
