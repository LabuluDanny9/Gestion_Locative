"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import type { ReportCurrency } from "./report-data";

const ReportCharts = dynamic(() => import("./report-charts").then((module) => module.ReportCharts), {
  loading: () => <Skeleton className="h-80 rounded-xl" />,
});

export function ReportChartSection({ currency, monthly }: { currency: ReportCurrency; monthly: { label: string; expected: number; collected: number }[] }) {
  return <ReportCharts currency={currency} monthly={monthly} />;
}
