"use client";

import { BadgeDollarSign, FileSignature, MessageCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function TenantQuickActions({ contractHref }: { contractHref: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.info("L’enregistrement des paiements sera activé dans le lot Paiements.")}><BadgeDollarSign />Enregistrer paiement</Button>
      <Button onClick={() => toast.info("La messagerie sera activée dans le lot Notifications & Messagerie.")} variant="outline"><MessageCircle />Envoyer message</Button>
      <Button asChild variant="outline"><Link href={contractHref}><FileSignature />Voir contrat</Link></Button>
    </div>
  );
}
