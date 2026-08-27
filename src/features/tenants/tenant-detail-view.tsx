import Link from "next/link";
import { CalendarClock, CalendarDays, FileSignature, FolderOpen, House, IdCard, Mail, MapPin, MessageCircle, MessagesSquare, Phone, ReceiptText, ShieldCheck, UserRound, Wallet, WalletCards } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MoneyDisplay } from "@/components/shared/money-display";
import { RentalStatusBadge } from "@/components/shared/rental-status-badge";
import { TenantAvatar } from "@/components/shared/tenant-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Tenant } from "./tenant-data";
import { TenantQuickActions } from "./tenant-quick-actions";
import { TenantStatusBadge } from "./tenant-status-badge";

export function TenantDetailView({ tenant, basePath, dashboardHref, unitBasePath, contractBasePath }: { tenant: Tenant; basePath: string; dashboardHref: string; unitBasePath: string; contractBasePath: string }) {
  const kpis = [
    { label: "Loyer mensuel", value: <MoneyDisplay amount={tenant.rent} currency={tenant.currency} />, icon: Wallet },
    { label: "Solde actuel", value: <MoneyDisplay amount={tenant.balance} currency={tenant.currency} />, icon: WalletCards },
    { label: "Prochaine échéance", value: tenant.nextDueDate, icon: CalendarClock },
    { label: "Garantie", value: <MoneyDisplay amount={tenant.guarantee} currency={tenant.currency} />, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: dashboardHref }, { label: "Locataires", href: basePath }, { label: tenant.name }]} />
      <header className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <TenantAvatar large name={tenant.name} />
          <div className="min-w-0"><div className="mb-2 flex flex-wrap items-center gap-2"><TenantStatusBadge status={tenant.status} /><span className="text-xs font-medium text-muted-foreground">{tenant.code}</span></div><h1 className="font-heading text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{tenant.name}</h1><div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4"><a className="flex items-center gap-1.5 hover:text-foreground" href={`tel:${tenant.phone.replace(/\s/g, "")}`}><Phone aria-hidden="true" className="size-3.5" />{tenant.phone}</a><a className="flex items-center gap-1.5 hover:text-foreground" href={`mailto:${tenant.email}`}><Mail aria-hidden="true" className="size-3.5" />{tenant.email}</a><Link className="flex items-center gap-1.5 hover:text-brand-blue" href={`${unitBasePath}/${tenant.unitId}`}><House aria-hidden="true" className="size-3.5" />{tenant.unitLabel}</Link></div></div>
        </div>
        <TenantQuickActions contractHref={`${contractBasePath}/${tenant.contractId}`} />
      </header>

      <section aria-label="Indicateurs du locataire" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="p-4"><span className="grid size-9 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon aria-hidden="true" className="size-4.5" /></span><p className="mt-3 text-xs text-muted-foreground">{label}</p><div className="mt-1 text-sm font-semibold tabular-nums sm:text-base">{value}</div></CardContent></Card>)}
      </section>

      <Tabs defaultValue="overview">
        <div className="overflow-x-auto border-b"><TabsList className="h-11 min-w-max" variant="line"><TabsTrigger value="overview"><UserRound />Vue générale</TabsTrigger><TabsTrigger value="payments"><WalletCards />Paiements</TabsTrigger><TabsTrigger value="due"><CalendarDays />Échéances</TabsTrigger><TabsTrigger value="contracts"><FileSignature />Contrats</TabsTrigger><TabsTrigger value="documents"><FolderOpen />Documents</TabsTrigger><TabsTrigger value="messages"><MessagesSquare />Messages</TabsTrigger></TabsList></div>

        <TabsContent className="mt-5" value="overview"><div className="grid gap-5 xl:grid-cols-2"><Card><CardHeader><CardTitle>Coordonnées</CardTitle><CardDescription>Informations de contact du locataire</CardDescription></CardHeader><CardContent className="grid gap-3"><InfoRow icon={Phone} label="Téléphone" value={tenant.phone} /><InfoRow icon={Mail} label="Email" value={tenant.email} /><InfoRow icon={MapPin} label="Adresse" value={tenant.address} /><InfoRow icon={UserRound} label="Contact d’urgence" value={tenant.emergencyContact} /></CardContent></Card><Card><CardHeader><CardTitle>Identité et occupation</CardTitle><CardDescription>Données de référence du dossier</CardDescription></CardHeader><CardContent className="grid gap-3"><InfoRow icon={IdCard} label={tenant.identityType} value={tenant.identityNumber} /><InfoRow icon={House} label="Logement" value={`${tenant.unitLabel} · ${tenant.propertyName}`} /><InfoRow icon={CalendarDays} label="Contrat" value={`${tenant.contractStart} → ${tenant.contractEnd}`} /><InfoRow icon={ShieldCheck} label="Garantie versée" value={`${new Intl.NumberFormat("fr-CD").format(tenant.guarantee)} ${tenant.currency}`} /></CardContent></Card></div></TabsContent>

        <TabsContent className="mt-5" value="payments"><Card><CardHeader><CardTitle>Historique des paiements</CardTitle><CardDescription>Derniers règlements enregistrés pour ce locataire</CardDescription></CardHeader><CardContent className="space-y-3">{tenant.payments.map((payment) => <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center" key={payment.id}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-status-paid/10 text-status-paid"><ReceiptText aria-hidden="true" className="size-5" /></span><div className="flex-1"><p className="font-semibold">{payment.period}</p><p className="mt-1 text-xs text-muted-foreground">{payment.paidAt} · {payment.receipt}</p></div><div className="flex items-center justify-between gap-3 sm:justify-end"><MoneyDisplay amount={payment.amount} className="font-semibold" currency={payment.currency} /><RentalStatusBadge status={payment.status} /><Button disabled size="sm" variant="ghost">Voir reçu</Button></div></div>)}</CardContent></Card></TabsContent>

        <TabsContent className="mt-5" value="due"><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Prochaine échéance</CardTitle><CardDescription>Loyer attendu</CardDescription></CardHeader><CardContent><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-status-upcoming/10 text-status-upcoming"><CalendarClock /></span><div><p className="font-semibold">{tenant.nextDueDate}</p><MoneyDisplay amount={tenant.rent} className="mt-1 text-sm text-muted-foreground" currency={tenant.currency} /></div></div></CardContent></Card><Card><CardHeader><CardTitle>Situation du compte</CardTitle><CardDescription>Montant à recouvrer</CardDescription></CardHeader><CardContent><div className="flex items-center justify-between"><MoneyDisplay amount={tenant.balance} className="font-heading text-2xl font-semibold" currency={tenant.currency} /><TenantStatusBadge status={tenant.status} /></div></CardContent></Card></div></TabsContent>

        <TabsContent className="mt-5" value="contracts"><Card><CardHeader><CardTitle>Contrat actif</CardTitle><CardDescription>La gestion détaillée sera finalisée dans le prochain lot frontend.</CardDescription></CardHeader><CardContent><div className="flex items-center gap-3 rounded-xl bg-muted/45 p-4"><FileSignature className="size-5 text-brand-blue" /><div><p className="font-semibold">Bail résidentiel</p><p className="mt-1 text-sm text-muted-foreground">{tenant.contractStart} → {tenant.contractEnd}</p></div></div></CardContent></Card></TabsContent>

        <TabsContent className="mt-5" value="documents"><Card><CardHeader><CardTitle>Documents du dossier</CardTitle><CardDescription>Aperçu des pièces qui seront conservées dans Supabase Storage.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><DocumentPreview icon={IdCard} label={`Copie ${tenant.identityType.toLocaleLowerCase("fr")}`} /><DocumentPreview icon={FileSignature} label="Contrat de location" /></CardContent></Card></TabsContent>

        <TabsContent className="mt-5" value="messages"><Card><CardHeader><CardTitle>Communications</CardTitle><CardDescription>Historique de contact — intégration WhatsApp et SMS prévue ultérieurement.</CardDescription></CardHeader><CardContent><div className="flex items-start gap-3 rounded-xl border border-dashed p-5"><MessageCircle className="mt-0.5 size-5 text-brand-blue" /><div><p className="font-semibold">Rappel d’échéance préparé</p><p className="mt-1 text-sm text-muted-foreground">Canal et statut d’envoi disponibles après activation de la messagerie.</p></div></div></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return <div className="flex items-start gap-3 rounded-xl bg-muted/45 p-3"><Icon aria-hidden="true" className="mt-0.5 size-4 text-brand-blue" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div></div>;
}

function DocumentPreview({ icon: Icon, label }: { icon: typeof IdCard; label: string }) {
  return <div className="flex items-center gap-3 rounded-xl border p-4"><span className="grid size-10 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue"><Icon aria-hidden="true" className="size-5" /></span><div><p className="font-medium">{label}</p><p className="mt-0.5 text-xs text-muted-foreground">Aperçu frontend</p></div></div>;
}
