"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardChartData } from "@/features/dashboard/dashboard-data";

const DashboardCharts = dynamic(
  () => import("./dashboard-charts").then((module) => module.DashboardCharts),
  {
    loading: () => (
      <div className="hidden gap-5 lg:grid lg:grid-cols-12">
        <Skeleton className="h-96 rounded-xl lg:col-span-7" />
        <Skeleton className="h-96 rounded-xl lg:col-span-5" />
      </div>
    ),
  },
);

export function DashboardChartSection({ data }: { data: DashboardChartData }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop ? <DashboardCharts data={data} /> : null;
}
