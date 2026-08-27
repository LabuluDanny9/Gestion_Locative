"use client";

import { useState } from "react";
import Link from "next/link";
import { Banknote, Check, CircleCheckBig, CirclePlus, Landmark, MessageCircle, Printer, ReceiptText, Search, Smartphone, WalletCards } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MoneyDisplay } from "@/components/shared/money-display";
import { PageHeader } from "@/components/shared/page-header";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tenants } from "@/features/tenants/tenant-data";
import { cn } from "@/lib/utils";

import type { PaymentMode } from "./payment-data";

const modes = [
  { value: "cash" as const, label: "Espèces", icon: Banknote },
  { value: "mobile" as const, label: "Mobile Money", icon: Smartphone },
  { value: "bank" as const, label: "Banque", icon: Landmark },
  { value: "card" as const, label: "Carte", icon: WalletCards },
];

export function PaymentFormPreview({ basePath, dashboardHref, receiptExampleHref, defaultTenant }: { basePath: string; dashboardHref: string; receiptExampleHref: string; defaultTenant?: string }) {
  const [selectedId, setSelectedId] = useState(defaultTenant && tenants.some((tenant) => tenant.id === defaultTenant) ? defaultTenant : "");
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<PaymentMode>("mobile");
  const [confirmed, setConfirmed] = useState(false);
  const selected = tenants.find((tenant) => tenant.id === selectedId);
  const received = Number(amount) || 0;
  const totalDue = selected ? selected.rent + selected.balance : 0;
  const allocated = Math.min(received, totalDue);
  const newBalance = Math.max(totalDue - received, 0);
  const surplus = Math.max(received - totalDue, 0);
  const arrearsAllocation = selected ? Math.min(selected.balance, received) : 0;
  const rentAllocation = Math.max(Math.min(received - arrearsAllocation, selected?.rent ?? 0), 0);
  const filteredTenants = tenants.filter((tenant) => !query || `${tenant.name} ${tenant.phone} ${tenant.unitLabel}`.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr")));

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return toast.error("Sélectionnez un locataire.");
    if (received <= 0) return toast.error("Saisissez un montant valide.");
    setConfirmed(true);
  }

  function reset() {
    setAmount("");
    setSelectedId("");
    setConfirmed(false);
  }

  return <div className="space-y-6"><div><Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Paiements", href: basePath }, { label: "Nouveau paiement" }]} /><PageHeader description="Sélectionnez le locataire, contrôlez sa situation et affectez automatiquement le montant reçu." eyebrow="Encaissement" title="Nouveau paiement" /></div><Badge variant="secondary">Prototype interactif · aucune transaction enregistrée</Badge><form className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={submit}><div className="space-y-5"><Card><CardHeader><CardTitle>1. Rechercher le locataire</CardTitle><CardDescription>Nom, téléphone ou logement</CardDescription></CardHeader><CardContent><label className="relative block"><span className="sr-only">Rechercher un locataire</span><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher..." value={query} /></label><div className="mt-3 grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">{filteredTenants.map((tenant) => <button className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition-colors", selectedId === tenant.id ? "border-brand-blue bg-brand-blue/5" : "hover:border-brand-blue/30")} key={tenant.id} onClick={() => setSelectedId(tenant.id)} type="button"><TenantAvatar name={tenant.name} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{tenant.name}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{tenant.phone} · {tenant.unitLabel}</span></span>{selectedId === tenant.id && <Check className="size-4 text-brand-blue" />}</button>)}</div></CardContent></Card>
      <Card><CardHeader><CardTitle>2. Montant et mode de paiement</CardTitle><CardDescription>Renseignez le montant réellement reçu.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="space-y-2"><Label htmlFor="payment-amount">Montant reçu</Label><div className="relative"><Input className="h-16 pr-20 font-heading text-2xl font-semibold" id="payment-amount" min="0.01" onChange={(event) => setAmount(event.target.value)} placeholder="0" required step="0.01" type="number" value={amount} /><span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-muted-foreground">{selected?.currency ?? "USD"}</span></div></div><fieldset><legend className="mb-2 text-sm font-medium">Mode de paiement</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{modes.map(({ value, label, icon: Icon }) => <label className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs font-medium has-checked:border-brand-blue has-checked:bg-brand-blue/5", mode === value && "text-brand-blue")} key={value}><input checked={mode === value} className="sr-only" name="mode" onChange={() => setMode(value)} type="radio" value={value} /><Icon className="size-5" />{label}</label>)}</div></fieldset></CardContent></Card>
      {selected && received > 0 && <Card><CardHeader><CardTitle>3. Affectation automatique</CardTitle><CardDescription>Les arriérés sont couverts avant le loyer courant.</CardDescription></CardHeader><CardContent className="space-y-2">{arrearsAllocation > 0 && <AllocationRow amount={arrearsAllocation} currency={selected.currency} label="Arriérés antérieurs" />}{rentAllocation > 0 && <AllocationRow amount={rentAllocation} currency={selected.currency} label="Septembre 2026" />}{surplus > 0 && <AllocationRow amount={surplus} currency={selected.currency} label="Avance non affectée" />}</CardContent></Card>}</div>
      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">{selected ? <Card><CardHeader><CardTitle>Situation financière</CardTitle><CardDescription>{selected.name} · {selected.unitLabel}</CardDescription></CardHeader><CardContent className="space-y-3"><SummaryRow amount={selected.rent} currency={selected.currency} label="Loyer courant" /><SummaryRow amount={selected.balance} currency={selected.currency} label="Arriérés" /><div className="border-t pt-3"><SummaryRow amount={totalDue} currency={selected.currency} emphasis label="Total dû" /></div></CardContent></Card> : <Card><CardContent className="p-8 text-center"><WalletCards className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 font-medium">Sélectionnez un locataire</p><p className="mt-1 text-sm text-muted-foreground">Sa situation financière apparaîtra ici.</p></CardContent></Card>}<Card className="border-brand-blue/20"><CardHeader><CardTitle>Résumé avant validation</CardTitle></CardHeader><CardContent className="space-y-3"><SummaryRow amount={received} currency={selected?.currency ?? "USD"} label="Montant reçu" /><SummaryRow amount={allocated} currency={selected?.currency ?? "USD"} label="Montant affecté" /><SummaryRow amount={newBalance} currency={selected?.currency ?? "USD"} emphasis label="Nouveau solde" /><Button className="mt-2 w-full" disabled={!selected || received <= 0} size="lg" type="submit"><CircleCheckBig />Valider le paiement</Button><p className="text-center text-[0.7rem] text-muted-foreground">Aucune donnée ne sera enregistrée pendant cet aperçu.</p></CardContent></Card></aside></form>
    <Dialog onOpenChange={setConfirmed} open={confirmed}><DialogContent className="sm:max-w-lg"><DialogHeader className="items-center text-center"><span className="grid size-16 place-items-center rounded-full bg-status-paid/10 text-status-paid"><CircleCheckBig className="size-8" /></span><DialogTitle className="mt-2 text-xl">Paiement validé dans l’aperçu</DialogTitle><DialogDescription>La transaction n’est pas encore enregistrée, mais le flux et le reçu sont prêts pour l’intégration backend.</DialogDescription></DialogHeader><div className="rounded-xl bg-muted/45 p-5 text-center"><MoneyDisplay amount={received} className="font-heading text-3xl font-semibold" currency={selected?.currency ?? "USD"} /><p className="mt-2 text-sm text-muted-foreground">REC-APERÇU-0001 · {selected?.name}</p></div><DialogFooter className="sm:flex-wrap"><Button asChild variant="outline"><Link href={receiptExampleHref}><ReceiptText />Voir un exemple</Link></Button><Button asChild variant="outline"><Link href={receiptExampleHref}><Printer />Imprimer un exemple</Link></Button><Button onClick={() => toast.info("WhatsApp sera connecté pendant la phase Messagerie.")} variant="outline"><MessageCircle />WhatsApp</Button><Button onClick={reset}><CirclePlus />Nouveau paiement</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

function AllocationRow({ label, amount, currency }: { label: string; amount: number; currency: "USD" | "CDF" }) {
  return <div className="flex items-center justify-between rounded-xl bg-muted/45 p-4"><div><p className="font-medium">{label}</p><p className="mt-0.5 text-xs text-muted-foreground">Affectation automatique</p></div><MoneyDisplay amount={amount} className="font-semibold" currency={currency} /></div>;
}

function SummaryRow({ label, amount, currency, emphasis = false }: { label: string; amount: number; currency: "USD" | "CDF"; emphasis?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><span className={emphasis ? "font-semibold" : "text-sm text-muted-foreground"}>{label}</span><MoneyDisplay amount={amount} className={emphasis ? "font-heading text-lg font-semibold" : "font-medium"} currency={currency} /></div>;
}
