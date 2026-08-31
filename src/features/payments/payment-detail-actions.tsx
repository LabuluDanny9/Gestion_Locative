"use client";

import Link from "next/link";
import { Printer, ReceiptText, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { PaymentStatus } from "./payment-data";

export function PaymentDetailActions({ paymentId, receiptHref, reverseAction, status }: { paymentId: string; receiptHref: string; reverseAction?: (form: FormData) => void | Promise<void>; status: PaymentStatus }) {
  return <div className="flex flex-wrap gap-2"><Button asChild><Link href={receiptHref}><ReceiptText />Voir le reçu</Link></Button><Button asChild variant="outline"><Link href={receiptHref}><Printer />Imprimer le reçu</Link></Button>{status !== "cancelled" && reverseAction ? <Dialog><DialogTrigger asChild><Button variant="destructive"><Trash2 />Supprimer le paiement</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Supprimer ce paiement ?</DialogTitle><DialogDescription>La suppression est comptable : les soldes des échéances seront restaurés et le reçu invalidé. Une trace d’audit restera conservée pour protéger l’exactitude financière.</DialogDescription></DialogHeader><form action={reverseAction} className="space-y-4"><input name="paymentId" type="hidden" value={paymentId} /><div className="space-y-2"><Label htmlFor="reversal-reason">Motif obligatoire</Label><Textarea id="reversal-reason" maxLength={500} minLength={5} name="reason" placeholder="Ex. Paiement enregistré deux fois" required /></div><DialogFooter><ReversalSubmitButton /></DialogFooter></form></DialogContent></Dialog> : null}</div>;
}

function ReversalSubmitButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending} type="submit" variant="destructive"><Trash2 />{pending ? "Suppression…" : "Confirmer la suppression"}</Button>;
}
