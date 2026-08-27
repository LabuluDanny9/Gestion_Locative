"use client";

import { Download, MessageCircle, Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ReceiptActions() {
  return <div className="flex flex-wrap gap-2 print:hidden"><Button onClick={() => window.print()}><Printer />Imprimer</Button><Button onClick={() => toast.info("La génération PDF sera connectée au service documentaire.")} variant="outline"><Download />PDF</Button><Button onClick={() => toast.info("L’envoi du reçu sera activé avec WhatsApp et SMS.")} variant="outline"><MessageCircle />Envoyer</Button></div>;
}
