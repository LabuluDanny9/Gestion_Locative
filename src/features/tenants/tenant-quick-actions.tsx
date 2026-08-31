"use client";

import { BadgeDollarSign, FileSignature, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function TenantQuickActions({ contractHref, paymentHref, tenantId, tenantName, deleteAction }: { contractHref: string; paymentHref: string; tenantId: string; tenantName: string; deleteAction?: (form: FormData) => void | Promise<void> }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild><Link href={paymentHref}><BadgeDollarSign />Enregistrer paiement</Link></Button>
      <Button onClick={() => toast.info("La messagerie sera activée dans le lot Notifications & Messagerie.")} variant="outline"><MessageCircle />Envoyer message</Button>
      <Button asChild variant="outline"><Link href={contractHref}><FileSignature />Voir contrat</Link></Button>
      {deleteAction ? <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2 />Supprimer</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Supprimer {tenantName} ?</AlertDialogTitle><AlertDialogDescription>Le dossier sera supprimé seulement s’il ne possède aucun contrat, paiement ou intervention liée. Les documents privés associés seront également retirés.</AlertDialogDescription></AlertDialogHeader><form action={deleteAction}><input name="tenantId" type="hidden" value={tenantId} /><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><TenantDeleteSubmit /></AlertDialogFooter></form></AlertDialogContent></AlertDialog> : null}
    </div>
  );
}

function TenantDeleteSubmit() {
  const { pending } = useFormStatus();
  return <Button disabled={pending} type="submit" variant="destructive"><Trash2 />{pending ? "Suppression…" : "Confirmer"}</Button>;
}
