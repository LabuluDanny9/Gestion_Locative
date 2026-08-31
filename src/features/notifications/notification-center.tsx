import Link from "next/link";
import { Bell, Check, CheckCheck, Clock3, ListFilter } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { markAllNotificationsReadAction, markNotificationReadAction } from "./actions";
import { filterNotifications, notificationLabels, type NotificationRow, type NotificationType } from "./notification-data";

export type NotificationListParams = { status?: string; type?: string };

const dateFormatter = new Intl.DateTimeFormat("fr-CD", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lubumbashi" });

export function NotificationCenter({ notifications, params }: { notifications: NotificationRow[]; params: NotificationListParams }) {
  const filtered = filterNotifications(notifications, params.status, params.type);
  const unreadCount = notifications.filter((notification) => notification.read_at === null).length;
  const types = Object.keys(notificationLabels) as NotificationType[];

  return <div className="space-y-6">
    <div>
      <Breadcrumbs items={[{ label: "Dashboard", href: "/espace" }, { label: "Notifications" }]} />
      <PageHeader actions={unreadCount > 0 ? <form action={markAllNotificationsReadAction}><Button type="submit" variant="outline"><CheckCheck />Tout marquer comme lu</Button></form> : undefined} description="Consultez les alertes réellement enregistrées pour votre organisation et suivez leur statut de lecture." eyebrow="Communication" title="Centre de notifications" />
    </div>
    <section className="grid gap-3 sm:grid-cols-3">
      <Card><CardContent className="flex items-center gap-3"><Bell className="size-5 text-brand-blue" /><div><p className="text-xs text-muted-foreground">Total</p><p className="font-heading text-xl font-semibold">{notifications.length}</p></div></CardContent></Card>
      <Card><CardContent className="flex items-center gap-3"><Clock3 className="size-5 text-amber-600" /><div><p className="text-xs text-muted-foreground">Non lues</p><p className="font-heading text-xl font-semibold">{unreadCount}</p></div></CardContent></Card>
      <Card><CardContent className="flex items-center gap-3"><Check className="size-5 text-emerald-600" /><div><p className="text-xs text-muted-foreground">Lues</p><p className="font-heading text-xl font-semibold">{notifications.length - unreadCount}</p></div></CardContent></Card>
    </section>
    <FilterBar><form action="/notifications" className="grid flex-1 gap-2 sm:grid-cols-[12rem_minmax(15rem,1fr)_auto]" method="GET">
      <select aria-label="Filtrer par lecture" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.status ?? "all"} name="status"><option value="all">Toutes</option><option value="unread">Non lues</option></select>
      <select aria-label="Filtrer par type" className="h-10 rounded-lg border bg-background px-3 text-sm" defaultValue={params.type ?? "all"} name="type"><option value="all">Tous les types</option>{types.map((type) => <option key={type} value={type}>{notificationLabels[type]}</option>)}</select>
      <Button type="submit" variant="secondary"><ListFilter />Appliquer</Button>
    </form></FilterBar>
    {filtered.length === 0 ? <EmptyState action={(params.status || params.type) ? <Button asChild variant="outline"><Link href="/notifications">Effacer les filtres</Link></Button> : undefined} description={notifications.length === 0 ? "Aucune alerte réelle n’a encore été enregistrée pour votre organisation." : "Aucune notification ne correspond aux filtres sélectionnés."} icon={Bell} title="Aucune notification" /> : <div className="space-y-3">{filtered.map((notification) => <Card className={cn(notification.read_at === null && "ring-brand-blue/30")} key={notification.id}><CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <span className={cn("mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl", notification.read_at === null ? "bg-brand-blue/10 text-brand-blue" : "bg-muted text-muted-foreground")}><Bell className="size-4.5" /></span>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{notification.title}</h2><Badge variant="secondary">{notificationLabels[notification.notification_type]}</Badge>{notification.read_at === null && <Badge>Non lue</Badge>}</div><p className="mt-2 text-sm leading-6 text-muted-foreground">{notification.body}</p><p className="mt-3 text-xs text-muted-foreground">{dateFormatter.format(new Date(notification.created_at))}</p></div>
      {notification.read_at === null && <form action={markNotificationReadAction}><input name="notificationId" type="hidden" value={notification.id} /><Button size="sm" type="submit" variant="ghost"><Check />Marquer comme lue</Button></form>}
    </CardContent></Card>)}</div>}
  </div>;
}
