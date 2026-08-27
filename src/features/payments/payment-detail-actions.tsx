"use client";

import Link from "next/link";
import { MessageCircle, Printer, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function PaymentDetailActions({ receiptHref }: { receiptHref: string }) {
  return <div className="flex flex-wrap gap-2"><Button asChild><Link href={receiptHref}><ReceiptText />Voir le reçu</Link></Button><Button asChild variant="outline"><Link href={receiptHref}><Printer />Imprimer le reçu</Link></Button><Button onClick={() => toast.info("L’envoi WhatsApp sera activé avec le module Messagerie.")} variant="outline"><MessageCircle />Envoyer</Button></div>;
}
