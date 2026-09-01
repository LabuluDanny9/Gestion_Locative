"use client";

import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReportActions({ exportHref }: { exportHref: string }) {
  return <div className="flex flex-wrap gap-2 print:hidden"><Button asChild variant="outline"><a href={exportHref}><Download />Exporter CSV</a></Button><Button onClick={() => window.print()}><Printer />Imprimer / PDF</Button></div>;
}
