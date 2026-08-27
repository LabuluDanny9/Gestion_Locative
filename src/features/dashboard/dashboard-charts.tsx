"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/shared/chart-card";
import { Button } from "@/components/ui/button";
import type { DashboardChartData } from "@/features/dashboard/dashboard-data";

function formatAmount(value: number) {
  return `${new Intl.NumberFormat("fr-CD", { maximumFractionDigits: 0 }).format(value)} USD`;
}

const tooltipStyle = {
  border: "1px solid var(--border)",
  borderRadius: "12px",
  background: "var(--popover)",
  boxShadow: "0 12px 30px rgb(15 23 42 / 10%)",
  color: "var(--popover-foreground)",
  fontSize: "12px",
};

export function DashboardCharts({ data }: { data: DashboardChartData }) {
  const [range, setRange] = useState<"six" | "all">("six");
  const chartData = range === "six" && data.revenue.length > 6 ? data.revenue.slice(-6) : data.revenue;

  return (
    <section aria-label="Analyses du dashboard" className="hidden gap-5 lg:grid lg:grid-cols-12">
      <ChartCard
        action={data.revenue.length > 6 ? (
          <div className="flex rounded-lg bg-muted p-1">
            <Button aria-pressed={range === "six"} onClick={() => setRange("six")} size="xs" variant={range === "six" ? "secondary" : "ghost"}>6 mois</Button>
            <Button aria-pressed={range === "all"} onClick={() => setRange("all")} size="xs" variant={range === "all" ? "secondary" : "ghost"}>Année</Button>
          </div>
        ) : undefined}
        className="lg:col-span-7"
        description="Évolution des encaissements sur la période"
        title="Revenus locatifs"
      >
        <div aria-label="Courbe des revenus locatifs" className="h-72 w-full" role="img">
          <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatAmount(Number(value ?? 0)), "Encaissé"]} />
              <Area activeDot={{ r: 5, fill: "#2563EB", stroke: "var(--card)", strokeWidth: 3 }} dataKey="collected" fill="url(#revenue-fill)" stroke="#2563EB" strokeWidth={2.5} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard className="lg:col-span-5" description="Situation actuelle des 45 unités" title="Répartition des logements">
        <div className="grid min-h-72 grid-cols-[1fr_9rem] items-center gap-2 xl:grid-cols-[1fr_10rem]">
          <div aria-label="Répartition des logements par statut" className="h-64 min-w-0" role="img">
            <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
              <PieChart>
                <Pie cx="50%" cy="50%" data={data.unitDistribution} dataKey="value" innerRadius={66} nameKey="name" outerRadius={92} paddingAngle={3} stroke="transparent">
                  {data.unitDistribution.map((entry) => <Cell fill={entry.color} key={entry.name} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value ?? 0} logements`, ""]} />
                <text dominantBaseline="middle" fill="var(--foreground)" fontSize="26" fontWeight="650" textAnchor="middle" x="50%" y="47%">45</text>
                <text dominantBaseline="middle" fill="var(--muted-foreground)" fontSize="11" textAnchor="middle" x="50%" y="58%">Logements</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {data.unitDistribution.map((entry) => (
              <div className="flex items-center justify-between gap-3 text-xs" key={entry.name}>
                <span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />{entry.name}</span>
                <span className="font-semibold tabular-nums">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard className="lg:col-span-12" description="Comparaison mensuelle en USD" title="Loyers attendus vs encaissés">
        <div className="mb-4 flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" />Attendus</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-sm bg-brand-blue" />Encaissés</span>
        </div>
        <div aria-label="Barres comparant les loyers attendus et encaissés" className="h-64 w-full" role="img">
          <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
              <XAxis axisLine={false} dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [formatAmount(Number(value ?? 0)), name === "expected" ? "Attendu" : "Encaissé"]} />
              <Bar dataKey="expected" fill="#CBD5E1" maxBarSize={24} radius={[5, 5, 0, 0]} />
              <Bar dataKey="collected" fill="#2563EB" maxBarSize={24} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </section>
  );
}
