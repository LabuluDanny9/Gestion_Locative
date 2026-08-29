import type { LucideIcon } from "lucide-react";
import {
  BadgeAlert,
  Bell,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  FileSignature,
  FolderOpen,
  House,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  WalletCards,
  Wrench,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  enabled: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const appNavigation: NavigationGroup[] = [
  {
    label: "Gestion",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/espace", enabled: true },
      { label: "Propriétés", icon: Building2, href: "/proprietes", enabled: true },
      { label: "Logements", icon: House, href: "/logements", enabled: true },
      { label: "Locataires", icon: Users, href: "/locataires", enabled: true },
      { label: "Contrats", icon: FileSignature, href: "/contrats", enabled: true },
    ],
  },
  {
    label: "Finances",
    items: [
      { label: "Échéances", icon: CalendarClock, href: "/echeances", enabled: true },
      { label: "Paiements", icon: WalletCards, href: "/paiements", enabled: true },
      { label: "Arriérés", icon: BadgeAlert, enabled: false },
      { label: "Garanties", icon: ShieldCheck, enabled: false },
      { label: "Reçus", icon: ReceiptText, href: "/recus", enabled: true },
    ],
  },
  {
    label: "Analyse",
    items: [
      { label: "Rapports", icon: ChartNoAxesCombined, enabled: false },
      { label: "Notifications", icon: Bell, enabled: false },
    ],
  },
  {
    label: "Système",
    items: [
      { label: "Documents", icon: FolderOpen, enabled: false },
      { label: "Maintenance", icon: Wrench, enabled: false },
      { label: "Utilisateurs", icon: UsersRound, enabled: false },
      { label: "Paramètres", icon: Settings, href: "/profil", enabled: true },
    ],
  },
];

export function getCurrentNavigationItem(pathname: string) {
  return appNavigation
    .flatMap((group) => group.items)
    .find((item) => item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`)));
}
