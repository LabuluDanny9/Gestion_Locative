"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/shared/chart-card";
import type { ReportCurrency } from "./report-data";

const tooltipStyle = { border: "1px solid var(--border)", borderRadius: "12px", background: "var(--popover)", color: "var(--popover-foreground)", fontSize: "12px" };

export function ReportCharts({ currency, monthly }: { currency: ReportCurrency; monthly: { label: string; expected: number; collected: number }[] }) {
  const format = (value: number) => `${new Intl.NumberFormat("fr-CD", { maximumFractionDigits: 0 }).format(value)} ${currency}`;
  return <ChartCard className="print:border print:shadow-none" description={`Comparaison mensuelle en ${currency}`} title="Attendu et encaissé"><div aria-label="Comparaison mensuelle des loyers attendus et encaissés" className="h-72 w-full" role="img"><ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%"><BarChart data={monthly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} /><XAxis axisLine={false} dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} /><YAxis axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => Intl.NumberFormat("fr-CD", { notation: "compact" }).format(Number(value))} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [format(Number(value ?? 0)), name === "expected" ? "Attendu" : "Encaissé"]} /><Bar dataKey="expected" fill="#CBD5E1" maxBarSize={26} radius={[5, 5, 0, 0]} /><Bar dataKey="collected" fill="#2563EB" maxBarSize={26} radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard>;
}
