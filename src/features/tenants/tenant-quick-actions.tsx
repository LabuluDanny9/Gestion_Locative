"use client";

import { BadgeDollarSign, FileSignature, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TenantQuickActions({ contractHref, paymentHref, tenantId, tenantName, deleteAction, messageAction }: { contractHref: string; paymentHref: string; tenantId: string; tenantName: string; deleteAction?: (form: FormData) => void | Promise<void>; messageAction?: (form: FormData) => void | Promise<void> }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild><Link href={paymentHref}><BadgeDollarSign />Enregistrer paiement</Link></Button>
      {messageAction ? <Dialog><DialogTrigger asChild><Button variant="outline"><MessageCircle />Envoyer message</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Écrire à {tenantName}</DialogTitle><DialogDescription>Le message sera envoyé par le fournisseur choisi et la tentative sera conservée dans le journal des notifications.</DialogDescription></DialogHeader><form action={messageAction} className="space-y-4"><input name="tenantId" type="hidden" value={tenantId} /><div className="space-y-2"><Label htmlFor="message-channel">Canal</Label><select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" defaultValue="sms" id="message-channel" name="channel"><option value="sms">SMS — TextBee</option><option value="whatsapp">WhatsApp — Meta Cloud API</option></select></div><div className="space-y-2"><Label htmlFor="tenant-message">Message</Label><Textarea id="tenant-message" maxLength={500} minLength={2} name="body" placeholder="Bonjour, votre message…" required rows={6} /><p className="text-xs text-muted-foreground">WhatsApp utilise le modèle Meta approuvé configuré dans Vercel.</p></div><DialogFooter><MessageSubmit /></DialogFooter></form></DialogContent></Dialog> : null}
      <Button asChild variant="outline"><Link href={contractHref}><FileSignature />Voir contrat</Link></Button>
      {deleteAction ? <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2 />Supprimer</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Supprimer {tenantName} ?</AlertDialogTitle><AlertDialogDescription>Le dossier sera supprimé seulement s’il ne possède aucun contrat, paiement ou intervention liée. Les documents privés associés seront également retirés.</AlertDialogDescription></AlertDialogHeader><form action={deleteAction}><input name="tenantId" type="hidden" value={tenantId} /><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><TenantDeleteSubmit /></AlertDialogFooter></form></AlertDialogContent></AlertDialog> : null}
    </div>
  );
}

function MessageSubmit() {
  const { pending } = useFormStatus();
  return <Button disabled={pending} type="submit"><MessageCircle />{pending ? "Envoi…" : "Envoyer"}</Button>;
}

function TenantDeleteSubmit() {
  const { pending } = useFormStatus();
  return <Button disabled={pending} type="submit" variant="destructive"><Trash2 />{pending ? "Suppression…" : "Confirmer"}</Button>;
}
