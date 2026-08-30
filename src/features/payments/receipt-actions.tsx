"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReceiptActions() {
  return <div className="flex flex-wrap gap-2 print:hidden"><Button onClick={() => window.print()}><Printer />Imprimer ou enregistrer en PDF</Button></div>;
}
