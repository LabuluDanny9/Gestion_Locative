"use client";

import { BadgeDollarSign, FileSignature, MessageCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function TenantQuickActions({ contractHref, paymentHref }: { contractHref: string; paymentHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild><Link href={paymentHref}><BadgeDollarSign />Enregistrer paiement</Link></Button>
      <Button onClick={() => toast.info("La messagerie sera activée dans le lot Notifications & Messagerie.")} variant="outline"><MessageCircle />Envoyer message</Button>
      <Button asChild variant="outline"><Link href={contractHref}><FileSignature />Voir contrat</Link></Button>
    </div>
  );
}
