"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  FileText,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

import { appNavigation, getCurrentNavigationItem, type NavigationItem } from "./app-navigation";

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
  displayName?: string;
  preview?: boolean;
  previewHomeHref?: string;
};

function getInitials(displayName?: string, email?: string) {
  const source = displayName?.trim() || email?.split("@")[0] || "GL";
  return source
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function resolveNavigationHref(href: string | undefined, preview: boolean, previewHomeHref: string) {
  if (!href || !preview) return href;
  return {
    "/espace": previewHomeHref,
    "/proprietes": "/design-system/proprietes",
    "/logements": "/design-system/logements",
    "/locataires": "/design-system/locataires",
    "/contrats": "/design-system/contrats",
    "/paiements": "/design-system/paiements",
    "/recus": "/design-system/recus",
    "/profil": "/design-system",
  }[href] ?? href;
}

function NavigationLink({ item, active, collapsed, forceLabels = false, onNavigate }: {
  item: NavigationItem;
  active: boolean;
  collapsed: boolean;
  forceLabels?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const content = (
    <>
      <Icon aria-hidden="true" className="size-[1.1rem] shrink-0" strokeWidth={1.9} />
      {!collapsed && <span className={cn("truncate", !forceLabels && "hidden xl:block")}>{item.label}</span>}
      {!collapsed && !item.enabled && (
        <span className={cn(
          "ml-auto rounded-full bg-white/8 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-400",
          !forceLabels && "hidden xl:inline",
        )}>
          bientôt
        </span>
      )}
    </>
  );

  const className = cn(
    "relative flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
    collapsed && "justify-center px-0",
    active
      ? "bg-sidebar-accent text-white before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary"
      : "text-slate-400 hover:bg-sidebar-accent/70 hover:text-white",
    !item.enabled && "cursor-not-allowed opacity-55 hover:bg-transparent hover:text-slate-400",
  );

  const element = item.enabled && item.href ? (
    <Link className={className} href={item.href} onClick={onNavigate}>{content}</Link>
  ) : (
    <button aria-label={`${item.label} — module bientôt disponible`} className={className} disabled type="button">
      {content}
    </button>
  );

  if (!collapsed) return element;

  return (
    <Tooltip>
      <TooltipTrigger asChild><span className="block">{element}</span></TooltipTrigger>
      <TooltipContent side="right">{item.label}{!item.enabled && " · bientôt"}</TooltipContent>
    </Tooltip>
  );
}

function SidebarNavigation({ pathname, collapsed, forceLabels = false, onNavigate, preview = false, previewHomeHref = "/design-system/shell" }: {
  pathname: string;
  collapsed: boolean;
  forceLabels?: boolean;
  onNavigate?: () => void;
  preview?: boolean;
  previewHomeHref?: string;
}) {
  return (
    <nav aria-label="Navigation principale" className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
      {appNavigation.map((group) => (
        <div key={group.label}>
          {!collapsed ? (
            <p className={cn(
              "mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-slate-500",
              !forceLabels && "hidden xl:block",
            )}>
              {group.label}
            </p>
          ) : (
            <div className="mx-auto mb-2 h-px w-6 bg-white/10 first:hidden" />
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const resolvedHref = resolveNavigationHref(item.href, preview, previewHomeHref);
              const isActive = resolvedHref === "/design-system"
                ? pathname === resolvedHref
                : Boolean(resolvedHref && (pathname === resolvedHref || pathname.startsWith(`${resolvedHref}/`)));
              return (
                <NavigationLink
                  active={isActive}
                  collapsed={collapsed}
                  forceLabels={forceLabels}
                  item={{ ...item, href: resolvedHref }}
                  key={item.label}
                  onNavigate={onNavigate}
                />
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Ouvrir les notifications" className="relative" size="icon" variant="ghost">
          <Bell aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand-blue ring-2 ring-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2">
        <DropdownMenuLabel className="px-2 py-2 text-sm text-foreground">Notifications</DropdownMenuLabel>
        <div className="rounded-lg border border-dashed bg-muted/30 px-5 py-7 text-center">
          <Bell aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Tout est calme</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Les alertes métier apparaîtront ici lorsque les modules seront activés.</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CreateMenu({ preview = false }: { preview?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-brand-blue text-white hover:bg-blue-700" size="lg">
          <Plus aria-hidden="true" />
          <span className="hidden sm:inline">Nouveau</span>
          <ChevronDown aria-hidden="true" className="hidden size-3.5 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Création rapide</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href={preview ? "/design-system/proprietes/nouvelle" : "/proprietes/nouvelle"}><Building2 />Propriété</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={preview ? "/design-system/logements/nouveau" : "/logements/nouveau"}><House />Logement</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={preview ? "/design-system/locataires/nouveau" : "/locataires/nouveau"}><Users />Locataire</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={preview ? "/design-system/contrats/nouveau" : "/contrats/nouveau"}><FileText />Contrat</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={preview ? "/design-system/paiements/nouveau" : "/paiements/nouveau"}><WalletCards />Paiement</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ email, displayName, preview = false }: { email?: string; displayName?: string; preview?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 gap-2 px-1.5 sm:pr-2" variant="ghost">
          <Avatar>
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {getInitials(displayName, email)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-left text-sm font-medium lg:block">{displayName || "Mon compte"}</span>
          <ChevronDown aria-hidden="true" className="hidden size-3.5 text-muted-foreground lg:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="px-2 py-2">
          <span className="block truncate text-sm text-foreground">{displayName || "Mon compte"}</span>
          <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href={preview ? "/design-system" : "/profil"}><UserRound />{preview ? "Retour au design system" : "Mon profil"}</Link></DropdownMenuItem>
        {!preview && (
          <>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem asChild variant="destructive">
                <button className="w-full" type="submit"><LogOut />Se déconnecter</button>
              </DropdownMenuItem>
            </form>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HelpMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Ouvrir l’aide" size="icon" variant="ghost"><CircleHelp aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Aide et références</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href="/design-system"><FileText />Design system</Link></DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="https://github.com/LabuluDanny9/Gestion_Locative" rel="noreferrer" target="_blank"><CircleHelp />Dépôt du projet</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children, email, displayName, preview = false, previewHomeHref = "/design-system/shell" }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentItem = preview
    ? pathname.startsWith("/design-system/proprietes") ? { label: "Propriétés" }
      : pathname.startsWith("/design-system/logements") ? { label: "Logements" }
        : pathname.startsWith("/design-system/locataires") ? { label: "Locataires" }
          : pathname.startsWith("/design-system/contrats") ? { label: "Contrats" }
            : pathname.startsWith("/design-system/paiements") ? { label: "Paiements" }
              : pathname.startsWith("/design-system/recus") ? { label: "Reçus" }
                : { label: "Dashboard" }
    : getCurrentNavigationItem(pathname);

  return (
    <div className="min-h-screen bg-background">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex xl:w-68",
        collapsed && "xl:w-20",
      )}>
        <div className="flex h-18 items-center border-b border-sidebar-border px-5">
          <Link href={preview ? previewHomeHref : "/espace"} aria-label="Retour au dashboard">
            <BrandMark className="[&>span:last-child]:hidden xl:[&>span:last-child]:flex" compact={collapsed} inverse />
          </Link>
        </div>
        <SidebarNavigation collapsed={collapsed} pathname={pathname} preview={preview} previewHomeHref={previewHomeHref} />
        <div className="border-t border-sidebar-border p-3">
          <Button
            aria-label={collapsed ? "Déployer la barre latérale" : "Réduire la barre latérale"}
            className="hidden w-full justify-center text-slate-400 hover:bg-sidebar-accent hover:text-white xl:flex"
            onClick={() => setCollapsed((value) => !value)}
            variant="ghost"
          >
            <ChevronLeft aria-hidden="true" className={cn("transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Réduire</span>}
          </Button>
        </div>
      </aside>

      <div className={cn("min-h-screen transition-[padding] duration-200 md:pl-20 xl:pl-68", collapsed && "xl:pl-20")}>
        <header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-xl sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button aria-label="Ouvrir la navigation" className="md:hidden" size="icon" variant="outline"><Menu /></Button>
            </SheetTrigger>
            <SheetContent className="data-[side=left]:w-[18rem] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground" side="left">
              <SheetHeader className="border-b border-sidebar-border px-5 py-4 text-left">
                <SheetTitle><BrandMark inverse /></SheetTitle>
              <SheetDescription className="sr-only">Navigation principale d’AMIRANDA EMPIRE</SheetDescription>
              </SheetHeader>
              <SidebarNavigation collapsed={false} forceLabels onNavigate={() => setMobileOpen(false)} pathname={pathname} preview={preview} previewHomeHref={previewHomeHref} />
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-28 md:block xl:min-w-36">
            <p className="text-xs text-muted-foreground">Espace de gestion</p>
            <p className="truncate text-sm font-semibold">{currentItem?.label ?? (preview ? "Dashboard" : "AMIRANDA EMPIRE")}</p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative hidden max-w-xl flex-1 md:block">
                <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  aria-label="Recherche globale — disponible avec les modules métier"
                  className="h-10 w-full cursor-not-allowed rounded-xl border bg-muted/45 pr-16 pl-9 text-sm outline-none placeholder:text-muted-foreground"
                  disabled
                  placeholder="Rechercher un locataire, logement, reçu..."
                  type="search"
                />
                <kbd className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md border bg-background px-1.5 py-0.5 text-[0.65rem] text-muted-foreground">⌘ K</kbd>
              </div>
            </TooltipTrigger>
            <TooltipContent>La recherche sera activée avec les modules métier.</TooltipContent>
          </Tooltip>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <CreateMenu preview={preview} />
            <NotificationMenu />
            <HelpMenu />
            <ThemeToggle />
            <UserMenu displayName={displayName} email={email} preview={preview} />
          </div>
        </header>

        <main className="px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8 xl:px-8">
          <div className="mx-auto max-w-[96rem]">{children}</div>
        </main>
      </div>

      <nav aria-label="Raccourcis mobiles" className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t bg-background/95 px-1 backdrop-blur-xl md:hidden">
        <Link className={cn("flex flex-col items-center justify-center gap-1 text-[0.65rem] font-medium", pathname === "/espace" || pathname === previewHomeHref ? "text-brand-blue" : "text-muted-foreground")} href={preview ? previewHomeHref : "/espace"}>
          <LayoutDashboard aria-hidden="true" className="size-4.5" />Accueil
        </Link>
        <Link className={cn("flex flex-col items-center justify-center gap-1 text-[0.65rem] font-medium", pathname.startsWith(preview ? "/design-system/proprietes" : "/proprietes") ? "text-brand-blue" : "text-muted-foreground")} href={preview ? "/design-system/proprietes" : "/proprietes"}>
          <Building2 aria-hidden="true" className="size-4.5" />Propriétés
        </Link>
        <Link className={cn("flex flex-col items-center justify-center gap-1 text-[0.65rem] font-medium", pathname.startsWith(preview ? "/design-system/logements" : "/logements") ? "text-brand-blue" : "text-muted-foreground")} href={preview ? "/design-system/logements" : "/logements"}>
          <House aria-hidden="true" className="size-4.5" />Logements
        </Link>
        <Link className={cn("flex flex-col items-center justify-center gap-1 text-[0.65rem] font-medium", pathname.startsWith(preview ? "/design-system/locataires" : "/locataires") ? "text-brand-blue" : "text-muted-foreground")} href={preview ? "/design-system/locataires" : "/locataires"}>
          <Users aria-hidden="true" className="size-4.5" />Locataires
        </Link>
        <Link className={cn("flex flex-col items-center justify-center gap-1 text-[0.65rem] font-medium", pathname.startsWith(preview ? "/design-system/paiements" : "/paiements") ? "text-brand-blue" : "text-muted-foreground")} href={preview ? "/design-system/paiements" : "/paiements"}>
          <WalletCards aria-hidden="true" className="size-4.5" />Paiements
        </Link>
      </nav>
    </div>
  );
}
