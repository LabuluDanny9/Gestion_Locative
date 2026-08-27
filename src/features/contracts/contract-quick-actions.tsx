"use client";

import { Download, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ContractQuickActions({ isDraft }: { isDraft: boolean }) {
  return <div className="flex flex-wrap gap-2"><Button onClick={() => toast.info(isDraft ? "La signature sera activée avec le backend documentaire." : "Le renouvellement sera disponible après validation du workflow.")}><RefreshCw />{isDraft ? "Finaliser" : "Renouveler"}</Button><Button onClick={() => toast.info("L’envoi au locataire sera connecté à la messagerie.")} variant="outline"><Send />Envoyer</Button><Button disabled title="Export disponible avec la génération documentaire" variant="outline"><Download />Télécharger</Button></div>;
}
